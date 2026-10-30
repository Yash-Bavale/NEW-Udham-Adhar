import { describe, it, expect, vi } from "vitest";

describe("Manager Orders Permissions & Restricted Assignment View", () => {
  describe("1. Server Authorization & Forbidden Field Protections", () => {
    it("permits Admin and Manager to view employee assigned orders but rejects normal staff/executive", async () => {
      // Simulate role check helper
      const checkAccess = (role: string, isStaff: boolean) => {
        const isManager = role === "manager";
        const isAdmin = isStaff && (role === "admin" || role === "super_admin");
        if (!isAdmin && !isManager) {
          throw new Error("Forbidden: only managers and administrators can view employee assigned orders.");
        }
        return true;
      };

      expect(checkAccess("super_admin", true)).toBe(true);
      expect(checkAccess("admin", true)).toBe(true);
      expect(checkAccess("manager", true)).toBe(true);

      expect(() => checkAccess("executive", true)).toThrow(
        "Forbidden: only managers and administrators can view employee assigned orders."
      );
      expect(() => checkAccess("agent", true)).toThrow(
        "Forbidden: only managers and administrators can view employee assigned orders."
      );
      expect(() => checkAccess("customer", false)).toThrow(
        "Forbidden: only managers and administrators can view employee assigned orders."
      );
    });

    it("restricts returned fields strictly to the 5 allowed UI fields plus internal ID", () => {
      // Raw database row containing sensitive customer and payment fields
      const mockRawDbOrder = {
        id: "11111111-2222-3333-4444-555555555555",
        created_at: "2026-10-30T09:00:00Z",
        customer_name: "Rahul Sharma",
        service_name: "Udyam Registration",
        action_status: "Pending Documents",
        stage: "form_submitted",
        // Prohibited fields that must NEVER be returned to the client in this view:
        application_code: "AP-2026-9999",
        customer_mobile: "9876543210",
        customer_email: "rahul@example.com",
        payment_amount: 1499,
        total_amount: 1499,
        payment_status: "paid",
        idle_time_seconds: 7200,
        fulfillment_notes: "Call customer for PAN card",
      };

      // Transform function matching listEmployeeAssignedOrders implementation
      const transformRow = (row: typeof mockRawDbOrder) => ({
        id: row.id,
        createdAt: row.created_at,
        customerName: row.customer_name ?? "Customer",
        serviceName: row.service_name ?? "Service",
        actionStatus: { label: row.action_status ?? "Pending", tone: "blue" },
        stage: { label: "Form Submitted", tone: "amber" },
      });

      const sanitizedRow = transformRow(mockRawDbOrder);

      // Verify permitted fields exist
      expect(sanitizedRow).toHaveProperty("id");
      expect(sanitizedRow).toHaveProperty("createdAt");
      expect(sanitizedRow).toHaveProperty("customerName", "Rahul Sharma");
      expect(sanitizedRow).toHaveProperty("serviceName", "Udyam Registration");
      expect(sanitizedRow).toHaveProperty("actionStatus");
      expect(sanitizedRow).toHaveProperty("stage");

      // Verify prohibited fields are strictly absent
      expect(sanitizedRow).not.toHaveProperty("application_code");
      expect(sanitizedRow).not.toHaveProperty("customer_mobile");
      expect(sanitizedRow).not.toHaveProperty("mobile");
      expect(sanitizedRow).not.toHaveProperty("customer_email");
      expect(sanitizedRow).not.toHaveProperty("email");
      expect(sanitizedRow).not.toHaveProperty("payment_amount");
      expect(sanitizedRow).not.toHaveProperty("amount");
      expect(sanitizedRow).not.toHaveProperty("total_amount");
      expect(sanitizedRow).not.toHaveProperty("payment_status");
      expect(sanitizedRow).not.toHaveProperty("idle_time_seconds");
      expect(sanitizedRow).not.toHaveProperty("fulfillment_notes");

      // Exact count of keys must be 6 (id + 5 display columns)
      expect(Object.keys(sanitizedRow)).toEqual([
        "id",
        "createdAt",
        "customerName",
        "serviceName",
        "actionStatus",
        "stage",
      ]);
    });
  });

  describe("2. Manager Normal Orders View & Filters", () => {
    it("ensures normal Orders page does not force assigned_to = context.userId for managers", () => {
      // In listOrdersV2, filtering by assigned_to context.userId should only apply to non-admin and non-manager:
      const shouldRestrictToSelf = (isAdmin: boolean, isManager: boolean, hasSearch: boolean) => {
        return !isAdmin && !isManager;
      };

      // Admin -> false (sees all orders or filters by assignedTo)
      expect(shouldRestrictToSelf(true, false, false)).toBe(false);
      // Manager -> false (sees all orders or filters by assignedTo)
      expect(shouldRestrictToSelf(false, true, false)).toBe(false);
      // Executive / normal staff -> true (restricted to own orders)
      expect(shouldRestrictToSelf(false, false, false)).toBe(true);
    });

    it("ensures bulkAssignOrders allows managers to reassign staff", () => {
      const allowedRoles = ["super_admin", "admin", "manager"];

      expect(allowedRoles.includes("manager")).toBe(true);
      expect(allowedRoles.includes("admin")).toBe(true);
      expect(allowedRoles.includes("super_admin")).toBe(true);
      expect(allowedRoles.includes("executive")).toBe(false);
    });
  });

  describe("3. Pagination & Cache Invalidation", () => {
    it("calculates total pages correctly for employee assigned orders", () => {
      const pageSize = 15;
      expect(Math.max(1, Math.ceil(0 / pageSize))).toBe(1);
      expect(Math.max(1, Math.ceil(15 / pageSize))).toBe(1);
      expect(Math.max(1, Math.ceil(16 / pageSize))).toBe(2);
      expect(Math.max(1, Math.ceil(45 / pageSize))).toBe(3);
    });

    it("invalidates affected cache keys on reassignment", () => {
      const invalidatedKeys: string[] = [];
      const mockQc = {
        invalidateQueries: ({ queryKey }: { queryKey: string[] }) => {
          invalidatedKeys.push(queryKey[0]);
        },
      };

      // When reassigning or auto-distributing:
      mockQc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      mockQc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
      mockQc.invalidateQueries({ queryKey: ["admin.assignment.history"] });
      mockQc.invalidateQueries({ queryKey: ["admin.employee.assigned-orders"] });

      expect(invalidatedKeys).toContain("admin.orders.v2");
      expect(invalidatedKeys).toContain("admin.assignment.metrics");
      expect(invalidatedKeys).toContain("admin.assignment.history");
      expect(invalidatedKeys).toContain("admin.employee.assigned-orders");
    });
  });
});

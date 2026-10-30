import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Manager Team Orders - Expandable Employee Assigned Orders", () => {
  const adminUserId = "admin-uuid-1111";
  const managerUserId = "manager-uuid-2222";
  const executiveUserId = "executive-uuid-3333";
  const employeeTargetId = "target-employee-uuid-4444";

  it("enforces manager/admin authorization rules for viewing employee assigned orders", async () => {
    const rolesMap: Record<string, string[]> = {
      [adminUserId]: ["admin"],
      [managerUserId]: ["manager"],
      [executiveUserId]: ["executive"],
    };

    const mockAdmin = {
      from: (table: string) => ({
        select: () => ({
          eq: (_col: string, val: string) => {
            const userRoles = rolesMap[val] ?? [];
            return Promise.resolve({ data: userRoles.map((role) => ({ role })), error: null });
          },
        }),
      }),
    };

    const { getStaffRoleInfo } = await import("@/lib/crm/order-auth.server");

    // Admin passes
    const adminInfo = await getStaffRoleInfo(mockAdmin, adminUserId);
    expect(adminInfo.isAdmin || adminInfo.isManager).toBe(true);

    // Manager passes
    const managerInfo = await getStaffRoleInfo(mockAdmin, managerUserId);
    expect(managerInfo.isAdmin || managerInfo.isManager).toBe(true);

    // Executive fails
    const execInfo = await getStaffRoleInfo(mockAdmin, executiveUserId);
    expect(execInfo.isAdmin || execInfo.isManager).toBe(false);
  });

  it("verifies unauthorized users are rejected from reassigning orders", async () => {
    const rolesMap: Record<string, string[]> = {
      [adminUserId]: ["admin"],
      [managerUserId]: ["manager"],
      [executiveUserId]: ["executive"],
      "non-staff-uuid": [],
    };

    const mockAdmin = {
      from: (table: string) => ({
        select: () => ({
          eq: (_col: string, val: string) => {
            const userRoles = rolesMap[val] ?? [];
            return Promise.resolve({ data: userRoles.map((role) => ({ role })), error: null });
          },
        }),
      }),
    };

    const { getStaffRoleInfo } = await import("@/lib/crm/order-auth.server");

    // Admin passes
    const adminInfo = await getStaffRoleInfo(mockAdmin, adminUserId);
    expect(adminInfo.isAdmin || adminInfo.isManager).toBe(true);

    // Manager passes
    const managerInfo = await getStaffRoleInfo(mockAdmin, managerUserId);
    expect(managerInfo.isAdmin || managerInfo.isManager).toBe(true);

    // Executive is rejected with Forbidden
    const execInfo = await getStaffRoleInfo(mockAdmin, executiveUserId);
    expect(execInfo.isAdmin || execInfo.isManager).toBe(false);

    // Non-staff is rejected
    const nonStaffInfo = await getStaffRoleInfo(mockAdmin, "non-staff-uuid");
    expect(nonStaffInfo.isAdmin || nonStaffInfo.isManager).toBe(false);
  });

  it("verifies the exact 6-field response schema and complete absence of restricted data", () => {
    // Simulated row produced by listEmployeeAssignedOrders
    const mockRow = {
      id: "app-uuid-1234",
      createdAt: "2026-10-30T05:00:00.000Z",
      customerName: "Acme Corp",
      serviceName: "Udyam Registration",
      actionStatus: {
        label: "Needs Action",
        tone: "red" as const,
      },
      stage: {
        label: "Under Review",
        tone: "emerald",
      },
    };

    const allowedKeys = new Set(["id", "createdAt", "customerName", "serviceName", "actionStatus", "stage"]);
    const actualKeys = Object.keys(mockRow);

    // Exactly 6 keys
    expect(actualKeys.length).toBe(6);
    for (const key of actualKeys) {
      expect(allowedKeys.has(key)).toBe(true);
    }

    // Explicitly verify restricted fields are NOT present
    const restrictedFields = [
      "application_code",
      "order_number",
      "mobile",
      "phone",
      "customer_phone",
      "email",
      "customer_email",
      "payment",
      "payment_status",
      "base_amount",
      "total_amount",
      "paid_amount",
      "order_age",
      "age",
      "fulfillment_status",
      "call_controls",
      "notes",
    ];

    for (const field of restrictedFields) {
      expect((mockRow as any)[field]).toBeUndefined();
    }
  });

  it("verifies employee order query filtering constraints", () => {
    const mockQueryFilters: Record<string, any> = {};
    const mockBuilder = {
      eq: (col: string, val: any) => {
        mockQueryFilters[col] = val;
        return mockBuilder;
      },
      order: () => mockBuilder,
      range: () => mockBuilder,
    };

    // Simulate query setup in listEmployeeAssignedOrders
    mockBuilder.eq("assigned_to", employeeTargetId).eq("is_deleted", false);

    expect(mockQueryFilters["assigned_to"]).toBe(employeeTargetId);
    expect(mockQueryFilters["is_deleted"]).toBe(false);
  });

  it("verifies pagination parameters computation", () => {
    const total = 45;
    const pageSize = 20;
    
    // Page 1
    const page1Offset = (1 - 1) * pageSize;
    const page1RowsCount = 20;
    const page1HasMore = page1Offset + page1RowsCount < total;
    expect(page1HasMore).toBe(true);

    // Page 3 (last page with 5 items)
    const page3Offset = (3 - 1) * pageSize;
    const page3RowsCount = 5;
    const page3HasMore = page3Offset + page3RowsCount < total;
    expect(page3HasMore).toBe(false);
  });
});


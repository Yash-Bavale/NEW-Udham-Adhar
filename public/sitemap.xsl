<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex,follow"/>
        <title>Sitemap · UdyamAdhar</title>
        <style>
          :root {
            --bg: #0b1020;
            --panel: #11172e;
            --text: #e6e9f5;
            --muted: #8a93b2;
            --border: #1f2747;
            --accent: #6366f1;
            --accent-2: #22d3ee;
            --row: #0f1530;
            --row-alt: #131a39;
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text);
            font: 14px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
          a { color: var(--accent-2); text-decoration: none; }
          a:hover { text-decoration: underline; }
          .wrap { max-width: 1100px; margin: 0 auto; padding: 32px 20px 64px; }
          header.hero {
            background: linear-gradient(135deg, rgba(99,102,241,.18), rgba(34,211,238,.10));
            border: 1px solid var(--border); border-radius: 16px; padding: 28px 28px;
          }
          .eyebrow { color: var(--accent-2); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; }
          h1 { margin: 6px 0 8px; font-size: 28px; letter-spacing: -.01em; }
          .lede { color: var(--muted); margin: 0; max-width: 70ch; }
          .stats { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
          .chip { background: var(--panel); border: 1px solid var(--border); border-radius: 999px;
            padding: 6px 12px; font-size: 12px; color: var(--muted); }
          .chip strong { color: var(--text); font-weight: 600; margin-right: 4px; }
          .toolbar { display: flex; gap: 10px; margin: 22px 0 12px; }
          .search { flex: 1; background: var(--panel); border: 1px solid var(--border);
            color: var(--text); padding: 10px 14px; border-radius: 10px; font: inherit; }
          .search:focus { outline: 2px solid var(--accent); }
          .card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
          table { width: 100%; border-collapse: collapse; }
          thead th { text-align: left; font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
            color: var(--muted); background: #0d1330; padding: 12px 16px; border-bottom: 1px solid var(--border); position: sticky; top: 0; }
          tbody tr { background: var(--row); border-bottom: 1px solid var(--border); }
          tbody tr:nth-child(even) { background: var(--row-alt); }
          tbody tr:hover { background: #182154; }
          td { padding: 10px 16px; vertical-align: middle; }
          td.num { color: var(--muted); width: 56px; font-variant-numeric: tabular-nums; }
          td.meta { color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; width: 1%; }
          .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
          .p-high { background: rgba(34,211,238,.14); color: #67e8f9; }
          .p-med { background: rgba(99,102,241,.18); color: #a5b4fc; }
          .p-low { background: rgba(148,163,184,.16); color: #cbd5e1; }
          footer { color: var(--muted); font-size: 12px; margin-top: 18px; text-align: center; }
          @media (max-width: 640px) {
            h1 { font-size: 22px; }
            td.meta { display: none; }
            thead th.meta { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header class="hero">
            <div class="eyebrow">XML Sitemap</div>
            <h1>UdyamAdhar — Site Index</h1>
            <p class="lede">A machine-readable index of every public page on this site. Search engines use this file to discover content; humans can browse it below.</p>
            <div class="stats">
              <span class="chip"><strong><xsl:value-of select="count(s:urlset/s:url)"/></strong> URLs</span>
              <span class="chip"><strong>Format</strong> sitemaps.org 0.9</span>
              <span class="chip"><strong>Updated</strong> <xsl:value-of select="substring(s:urlset/s:url[1]/s:lastmod,1,10)"/></span>
            </div>
          </header>

          <div class="toolbar">
            <input id="q" class="search" type="search" placeholder="Filter URLs… (e.g. udyam, certificate)" oninput="filterRows(this.value)"/>
          </div>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th class="num">#</th>
                  <th>URL</th>
                  <th class="meta">Priority</th>
                  <th class="meta">Change</th>
                  <th class="meta">Last modified</th>
                </tr>
              </thead>
              <tbody id="rows">
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td class="num"><xsl:value-of select="position()"/></td>
                    <td>
                      <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                    </td>
                    <td class="meta">
                      <xsl:variable name="p" select="s:priority"/>
                      <xsl:choose>
                        <xsl:when test="$p &gt;= 0.9"><span class="pill p-high"><xsl:value-of select="$p"/></span></xsl:when>
                        <xsl:when test="$p &gt;= 0.7"><span class="pill p-med"><xsl:value-of select="$p"/></span></xsl:when>
                        <xsl:otherwise><span class="pill p-low"><xsl:value-of select="$p"/></span></xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td class="meta"><xsl:value-of select="s:changefreq"/></td>
                    <td class="meta"><xsl:value-of select="substring(s:lastmod,1,10)"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            Generated by UdyamAdhar
          </footer>
        </div>
        <script>
          function filterRows(q){
            q = (q||'').toLowerCase().trim();
            var rows = document.querySelectorAll('#rows tr');
            rows.forEach(function(r){
              var t = r.innerText.toLowerCase();
              r.style.display = (!q || t.indexOf(q) !== -1) ? '' : 'none';
            });
          }
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

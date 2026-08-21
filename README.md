flowchart TD

subgraph group_runtime["Runtime &amp; Routes"]
  node_start{{"Application start<br/>Bun/Vite entry<br/>[start.ts]"}}
  node_server{{"Server runtime<br/>server entry<br/>[server.ts]"}}
  node_router["File-based router<br/>[router.tsx]"]
  node_root["Root shell<br/>route shell<br/>[__root.tsx]"]
  node_audit_form["Audit submission<br/>index route<br/>[index.tsx]"]
end

subgraph group_audit["Audit Pipeline"]
  node_audit_functions["Audit API boundary<br/>client functions<br/>[audit.functions.ts]"]
  node_audit_server["Audit execution<br/>server domain service<br/>[audit.server.ts]"]
  node_audit_types["Report contract<br/>shared types<br/>[audit-types.ts]"]
end

subgraph group_reports["Report Experience"]
  node_report_route["Report route<br/>parameterized route<br/>[report.$id.tsx]"]
  node_report_view["Report results<br/>audit UI<br/>[ReportView.tsx]"]
  node_score_ring["Score visualization<br/>audit component<br/>[ScoreRing.tsx]"]
  node_priority_badge["Priority indicators<br/>audit component<br/>[PriorityBadge.tsx]"]
  node_share_kit["Share kit<br/>audit component<br/>[ShareKit.tsx]"]
  node_public_assets["Public embeds<br/>public API routes<br/>[badge.$id.ts]"]
end

subgraph group_backend["Data &amp; Identity"]
  node_supabase[("Supabase integration<br/>browser/server clients<br/>[client.server.ts]")]
  node_auth["Auth attachment<br/>middleware<br/>[auth-middleware.ts]"]
  node_history["Audit history<br/>domain library and route<br/>[audit-history.ts]"]
end

subgraph group_growth["Growth &amp; Community"]
  node_growth["Growth loops<br/>domain libraries<br/>[growth.ts]"]
  node_community["Community route<br/>[community.tsx]"]
end

node_operations["Error &amp; delivery<br/>operational modules<br/>[error-capture.ts]"]

node_start -->|"boots"| node_server
node_server -->|"serves"| node_router
node_router -->|"mounts"| node_root
node_root -->|"renders"| node_audit_form
node_audit_form -->|"submits URL"| node_audit_functions
node_audit_functions -->|"invokes"| node_audit_server
node_audit_server -->|"produces"| node_audit_types
node_audit_server -->|"persists reports"| node_supabase
node_auth -->|"attaches identity"| node_supabase
node_router -->|"matches report ID"| node_report_route
node_report_route -->|"loads report"| node_audit_server
node_report_route -->|"renders"| node_report_view
node_report_view -->|"consumes"| node_audit_types
node_report_view -->|"uses"| node_score_ring
node_report_view -->|"uses"| node_priority_badge
node_report_view -->|"offers sharing"| node_share_kit
node_share_kit -->|"links embeds"| node_public_assets
node_public_assets -->|"loads public report"| node_audit_server
node_history -->|"reads saved audits"| node_supabase
node_growth -->|"supports"| node_community
node_server -.->|"reports failures"| node_operations

click node_start "https://github.com/widgetifyai/web-audit-9/blob/main/src/start.ts"
click node_server "https://github.com/widgetifyai/web-audit-9/blob/main/src/server.ts"
click node_router "https://github.com/widgetifyai/web-audit-9/blob/main/src/router.tsx"
click node_root "https://github.com/widgetifyai/web-audit-9/blob/main/src/routes/__root.tsx"
click node_audit_form "https://github.com/widgetifyai/web-audit-9/blob/main/src/routes/index.tsx"
click node_audit_functions "https://github.com/widgetifyai/web-audit-9/blob/main/src/lib/audit.functions.ts"
click node_audit_server "https://github.com/widgetifyai/web-audit-9/blob/main/src/lib/audit.server.ts"
click node_audit_types "https://github.com/widgetifyai/web-audit-9/blob/main/src/lib/audit-types.ts"
click node_report_route "https://github.com/widgetifyai/web-audit-9/blob/main/src/routes/report.%24id.tsx"
click node_report_view "https://github.com/widgetifyai/web-audit-9/blob/main/src/components/audit/ReportView.tsx"
click node_score_ring "https://github.com/widgetifyai/web-audit-9/blob/main/src/components/audit/ScoreRing.tsx"
click node_priority_badge "https://github.com/widgetifyai/web-audit-9/blob/main/src/components/audit/PriorityBadge.tsx"
click node_share_kit "https://github.com/widgetifyai/web-audit-9/blob/main/src/components/audit/ShareKit.tsx"
click node_public_assets "https://github.com/widgetifyai/web-audit-9/blob/main/src/routes/api/public/badge.%24id.ts"
click node_supabase "https://github.com/widgetifyai/web-audit-9/blob/main/src/integrations/supabase/client.server.ts"
click node_auth "https://github.com/widgetifyai/web-audit-9/blob/main/src/integrations/supabase/auth-middleware.ts"
click node_history "https://github.com/widgetifyai/web-audit-9/blob/main/src/lib/audit-history.ts"
click node_growth "https://github.com/widgetifyai/web-audit-9/blob/main/src/lib/growth.ts"
click node_community "https://github.com/widgetifyai/web-audit-9/blob/main/src/routes/community.tsx"
click node_operations "https://github.com/widgetifyai/web-audit-9/blob/main/src/lib/error-capture.ts"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_start,node_server,node_router,node_root,node_audit_form toneBlue
class node_audit_functions,node_audit_server,node_audit_types toneAmber
class node_report_route,node_report_view,node_score_ring,node_priority_badge,node_share_kit,node_public_assets toneMint
class node_supabase,node_auth,node_history toneRose
class node_growth,node_community toneIndigo
class node_operations toneNeutral

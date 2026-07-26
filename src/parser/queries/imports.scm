(import_statement
  source: (string (string_fragment) @import_source)
)

(import_require_clause
  source: (string (string_fragment) @import_source)
)

(export_statement
  source: (string (string_fragment) @import_source)
)

(call_expression
  function: (import)
  arguments: (arguments (string (string_fragment) @import_source))
)

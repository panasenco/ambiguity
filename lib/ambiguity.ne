main -> text_with_possibilities
text_with_possibilities -> text_without_possibilities
  | text_with_possibilities possibilities_container text_without_possibilities
text_without_possibilities -> [^<]:*
  | text_without_possibilities "<" [^|]
possibilities_container -> "<|" possibilities "|>"
possibilities -> [^|]:+
  | possibilities "|" [^|]:+

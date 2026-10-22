# Writing conventions

Applies to all prose across the repo: the marketing site, API docs, README files, source-code comments and JSDoc, commit/PR text, and user-facing runtime strings.

## Spelling: UK English for prose, US for code

- **Prose, headings, visible labels, nav, docs, comments, JSDoc, error messages:** use **UK** spelling. Write "colour", "behaviour", "centre", "licence" (noun), "organisation".
- **Code identifiers, property names, type names, CSS values, file names:** keep whatever the API actually uses. The public API is **US-spelled** (`color`, `backgroundColor`, `fontColor`, `borderColor`, `gridColor`, `viewportColor`), matching the web platform (CSS, Canvas). Do **not** rename these; that would be a breaking change.

So prose describes a US-spelled identifier in UK words, e.g. "The background **colour** of the item" documenting the `backgroundColor` property. This mirrors how MDN and framework docs write prose around CSS properties. The `ColorPalette` class name and `color-palette.html` filename stay US-spelled because they are identifiers/paths.

Quick rule: if a human reads it as a sentence, spell it "colour". If a machine parses it as a name, leave it `color`.

## No em or en dashes

Never use em dashes (—) or en dashes (–) anywhere. They read as AI-generated. Rewrite as natural prose using commas, colons, full stops, or parentheses. Avoid the dangling ` - ` clause pattern too.

For titles and separators use ` | ` (e.g. page `<title>` tags). For ranges in prose write "to" ("Mon to Fri"), not a dash.

## Tone

Concrete and specific over generic. Avoid hollow filler ("powerful", "seamlessly", "robust", "with ease", "a breeze") and empty intros that just restate the heading. Show the mechanism rather than asserting a quality.

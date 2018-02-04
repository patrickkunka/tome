# Tome
An extensible, dependency-free rich text editor.

In progress..

#### Todos

- ~~~Ensure active markups are always accurate on set selection~~~
- ~~~Add line-break functionality~~~
- Add whitespace trimming/collapsing via configuration
- ~~~remove collapsed inline markup cruft when changing selection (see toggle inline todo)~~~
- ~~~Increase plain text block break to two newline chars~~~
- ~~~Add push/replace state functionality to ensure history is logical~~~
- ~~~Basic clipboard sanitization~~~
- ~~~Create facade and public API~~~
- ~~~Move all history related actions out of `Tome` and into to a new state manager class~~~
- lists?
- additional IME mutation detection work

list stories:
- ~~~user converts an existing block selection to a list~~~
- ~~~user block returns inside a list item, splits the list item to create a new list item within the list, list is expanded~~~
- ~~~user types into newly created empty list item, list item persists and is extended~~~
- ~~~user block returns at the end of the last list item in a list, creates an empty list item below, list is expanded~~~
- ~~~user block returns at the start of the last (empty) list item in a list, converting the list item to a paragraph tag, list is contracted or split~~~
- ~~~as above, when a list is split, a second list is created~~~
- user deletes a list item via backspace, list item is removed and list is contracted
- user deletes or inserts characters within a list, the list is expanded or contracted
- user deletes/inserts characters spanning one or more list items, the outermost list items are joined, list is expanded or contracted
- user backspace from start of first list item in a list, the item is converted to a paragraph, list is contracted to start from next list item or removed if none
- user converts one or more li blocks to another block type. Wrapping UL is removed, list items are converted.
- user backspaces from the beginning of one to list to a preceding list. The two lists are joined and take on the list type of the first list.

---
*&copy; 2017 Patrick Kunka / KunkaLabs Ltd*

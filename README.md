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
- ~~~lists~~~
- additional IME mutation detection work
- ~~~performance optimisations~~~
- if at character after a custom block and backspacing, delete the custom block (trigger warn callback)
- if at character before a custom block and deleting, delete the custom block (trigger warn callback)
- if in an empty <p> and inserting a custom block, replace the <p> with it
- if changing block type or toggling inline markup over an inline block, ignore it

---
*&copy; 2017 Patrick Kunka / KunkaLabs Ltd*

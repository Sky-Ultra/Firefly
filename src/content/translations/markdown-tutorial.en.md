---
translationOf: markdown-tutorial.md
sourceHash: sha256:7f1384d4d6d13e03026d21f1d1399e942086706d2f306d7ab7fe6346b61c3adc
---

This is a practical example of how to write a Markdown file. It covers the core syntax together with the most common GitHub Flavored Markdown extensions.

- [Block elements](#block-elements)
    - [Paragraphs and line breaks](#paragraphs-and-line-breaks)
    - [Headings](#headers)
    - [Blockquotes](#blockquotes)
    - [Lists](#lists)
    - [Code blocks](#code-blocks)
    - [Horizontal rules](#horizontal-rules)
    - [Tables](#table)
- [Inline elements](#span-elements)
    - [Links](#links)
    - [Emphasis](#emphasis)
    - [Inline code](#code)
    - [Images](#images)
    - [Strikethrough](#strikethrough)
- [Miscellaneous](#miscellaneous)
    - [Automatic links](#automatic-links)
    - [Backslash escapes](#backslash-escapes)
- [Inline HTML](#inline-html)

<a id="block-elements"></a>
## Block Elements

<a id="paragraphs-and-line-breaks"></a>
### Paragraphs and Line Breaks

#### Paragraphs

HTML tag: `<p>`

Separate paragraphs with one or more blank lines. A line containing only **spaces** or **tabs** also counts as blank.

Code:

    This will be
    inline.

    This is second paragraph.

Preview:

---

This will be
inline.

This is second paragraph.

---

#### Line Breaks

HTML tag: `<br />`

Add **two or more spaces** at the end of a line to insert a line break.

Code:

    This will be not
    inline.

Preview:

---

This will be not  
inline.

---

<a id="headers"></a>
### Headings

Markdown supports two heading styles: Setext and ATX.

#### Setext

HTML tags: `<h1>`, `<h2>`

Underline text with any number of **equals signs (=)** for `<h1>`, or **hyphens (-)** for `<h2>`.

Code:

    This is an H1
    =============
    This is an H2
    -------------

Preview:

---

# This is an H1

## This is an H2

---

#### ATX

HTML tags: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

Start a line with one to six **hash signs (#)** to create the matching heading level.

Code:

    # This is an H1
    ## This is an H2
    ###### This is an H6

Preview:

---

# This is an H1

## This is an H2

###### This is an H6

---

You may close an ATX heading with hash signs at the end of the line. The closing count **does not have to match** the opening count.

Code:

    # This is an H1 #
    ## This is an H2 ##
    ### This is an H3 ######

Preview:

---

# This is an H1

## This is an H2

### This is an H3

---

<a id="blockquotes"></a>
### Blockquotes

HTML tag: `<blockquote>`

Markdown uses the email-style **>** marker for quotations. For the clearest source, wrap the text manually and place > at the start of each line.

Code:

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    > consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    > Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
    >
    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    > id sem consectetuer libero luctus adipiscing.

Preview:

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Markdown also allows a shortcut: in a hard-wrapped paragraph, only the first line needs the > marker.

Code:

    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

Preview:

---

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.

---

Blockquotes can be nested by adding another > level.

Code:

    > This is the first level of quoting.
    >
    > > This is nested blockquote.
    >
    > Back to the first level.

Preview:

---

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

---

A blockquote can contain other Markdown elements, including headings, lists, and code blocks.

Code:

    > ## This is a header.
    >
    > 1.   This is the first list item.
    > 2.   This is the second list item.
    >
    > Here's some example code:
    >
    >     return shell_exec("echo $input | $markdown_script");

Preview:

---

> ## This is a header.
>
> 1.  This is the first list item.
> 2.  This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");

---

<a id="lists"></a>
### Lists

Markdown supports ordered lists (numbers) and unordered lists (bullets).

#### Unordered Lists

HTML tag: `<ul>`

Use an **asterisk (\*)**, **plus sign (+)**, or **hyphen (-)** for each item.

Code:

    *   Red
    *   Green
    *   Blue

Preview:

---

- Red
- Green
- Blue

---

This is equivalent to:

Code:

    +   Red
    +   Green
    +   Blue

Or:

Code:

    -   Red
    -   Green
    -   Blue

#### Ordered Lists

HTML tag: `<ol>`

An ordered-list item begins with a number and a period:

Code:

    1.  Bird
    2.  McHale
    3.  Parish

Preview:

---

1.  Bird
2.  McHale
3.  Parish

---

A line like the following may trigger a list unintentionally:

Code:

    1986. What a great season.

Preview:

---

1986. What a great season.

---

Escape the period with a **backslash (\\)** when you want literal text:

Code:

    1986\. What a great season.

Preview:

---

1986\. What a great season.

---

#### Indented Content in Lists

##### Blockquotes Inside List Items

Indent the whole > marker when a list item contains a blockquote:

Code:

    *   A list item with a blockquote:

        > This is a blockquote
        > inside a list item.

Preview:

---

- A list item with a blockquote:

  > This is a blockquote
  > inside a list item.

---

##### Code Blocks Inside List Items

Indent a code block by two levels inside a list item: **eight spaces** or **two tabs**.

Code:

    *   A list item with a code block:

            <code goes here>

Preview:

---

- A list item with a code block:

      <code goes here>

---

##### Nested Lists

Code:

    * A
      * A1
      * A2
    * B
    * C

Preview:

---

- A
  - A1
  - A2
- B
- C

---

<a id="code-blocks"></a>
### Code Blocks

HTML tag: `<pre>`

Indent every line by at least **four spaces** or **one tab**.

Code:

    This is a normal paragraph:

        This is a code block.

Preview:

---

This is a normal paragraph:

    This is a code block.

---

The code block continues until Markdown reaches an unindented line or the end of the document.

Inside a code block, **ampersands (&)** and angle brackets **(< >)** are converted to HTML entities automatically.

Code:

        <div class="footer">
            &copy; 2004 Foo Corporation
        </div>

Preview:

---

    <div class="footer">
        &copy; 2004 Foo Corporation
    </div>

---

The fenced blocks and syntax highlighting below are extensions, but they are often the most convenient way to write code in a post.

#### Fenced Code Blocks

Wrap code in matching backtick fences, as shown below, and the four-space indentation is no longer needed.

Code:

    Here's an example:

    ```
    function test() {
      console.log("notice the blank line before this function?");
    }
    ```

Preview:

---

Here's an example:

```
function test() {
  console.log("notice the blank line before this function?");
}
```

---

#### Syntax Highlighting

Add an optional language name after the opening fence to enable syntax highlighting for that language.

Code:

    ```ruby
    require 'redcarpet'
    markdown = Redcarpet.new("Hello World!")
    puts markdown.to_html
    ```

Preview:

---

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

---

<a id="horizontal-rules"></a>
### Horizontal Rules

HTML tag: `<hr />`
Place **three or more hyphens (-), asterisks (\*), or underscores (\_)** on a line. Spaces between the symbols are allowed.

Code:

    * * *
    ***
    *****
    - - -
    ---------------------------------------
    ___

Preview:

---

---

---

---

---

---

---

---

<a id="table"></a>
### Tables

HTML tag: `<table>`

Tables are an extension to standard Markdown.

Use **pipes (|)** to separate columns and **hyphens (-)** to divide the header from the body. Add **colons (:)** to set alignment.

Outer pipes and column alignment are optional. Each header separator needs at least **three hyphens**.

Code:

```
| Left | Center | Right |
|:-----|:------:|------:|
|aaa   |bbb     |ccc    |
|ddd   |eee     |fff    |

 A | B
---|---
123|456


A |B
--|--
12|45
```

Preview:

---

| Left | Center | Right |
| :--- | :----: | ----: |
| aaa  |  bbb   |   ccc |
| ddd  |  eee   |   fff |

| A   | B   |
| --- | --- |
| 123 | 456 |

| A   | B   |
| --- | --- |
| 12  | 45  |

---

<a id="span-elements"></a>
## Inline Elements

<a id="links"></a>
### Links

HTML tag: `<a>`

Markdown has two link styles: inline links and reference links.

#### Inline Links

The inline format is `[text](URL "title")`.

The title is optional.

Code:

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute.

Preview:

---

This is [an example](http://example.com/ "Title") inline link.

[This link](http://example.net/) has no title attribute.

---

Use a relative path when linking to a local page or asset on the same site:

Code:

    See my [About](/about/) page for details.

Preview:

---

See my [About](/about/) page for details.

---

#### Reference Links

Define a link reference in advance with `[id]: URL "title"`.

The title is optional here as well. Refer to it later with `[text][id]`.

Code:

    [id]: http://example.com/  "Optional Title Here"
    This is [an example][id] reference-style link.

Preview:

---

[id]: http://example.com/ "Optional Title Here"

This is [an example][id] reference-style link.

---

In a reference definition:

- Square brackets contain the link identifier; it is **case-insensitive** and may be indented by up to three spaces
- A colon follows the identifier
- One or more spaces or tabs come next
- Then comes the link URL
- The URL may optionally be wrapped in angle brackets
- An optional title can follow in quotation marks or parentheses

These definitions are equivalent:

Code:

    [foo]: http://example.com/  "Optional Title Here"
    [foo]: http://example.com/  'Optional Title Here'
    [foo]: http://example.com/  (Optional Title Here)
    [foo]: <http://example.com/>  "Optional Title Here"

With empty square brackets, the link text itself becomes the reference name.

Code:

    [Google]: http://google.com/
    [Google][]

Preview:

---

[Google]: http://google.com/

[Google][]

---

<a id="emphasis"></a>
### Emphasis

HTML tags: `<em>`, `<strong>`

Markdown uses **asterisks (\*)** or **underscores (\_)** for emphasis. **One delimiter** produces `<em>`; **two delimiters** produce `<strong>`.

Code:

    *single asterisks*

    _single underscores_

    **double asterisks**

    __double underscores__

Preview:

---

_single asterisks_

_single underscores_

**double asterisks**

**double underscores**

---

When spaces sit directly inside the delimiters, Markdown treats the symbols as literal characters rather than emphasis.

Use a backslash to escape them explicitly:

Code:

    \*this text is surrounded by literal asterisks\*

Preview:

---

\*this text is surrounded by literal asterisks\*

---

<a id="code"></a>
### Inline Code

HTML tag: `<code>`

Wrap the code in **backticks (`)**.

Code:

    Use the `printf()` function.

Preview:

---

Use the `printf()` function.

---

If the code itself contains a backtick, use **multiple backticks** as the outer delimiter:

Code:

    ``There is a literal backtick (`) here.``

Preview:

---

``There is a literal backtick (`) here.``

---

The outer delimiter may include one leading and trailing space. This makes it possible to place a backtick at either edge of the code span:

Code:

    A single backtick in a code span: `` ` ``

    A backtick-delimited string in a code span: `` `foo` ``

Preview:

---

A single backtick in a code span: `` ` ``

A backtick-delimited string in a code span: `` `foo` ``

---

<a id="images"></a>
### Images

HTML tag: `<img />`

Image syntax follows the same pattern as links and supports both inline and reference forms.

#### Inline Images

The inline form is `![alt text](URL "title")`.

The title is optional.

Code:

    ![Alt text](/path/to/img.jpg)

    ![Alt text](/path/to/img.jpg "Optional title")

Preview:

---

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp)

![Alt text](https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title")

---

The syntax consists of:

- An exclamation mark
- Square brackets containing the alternative text
- Parentheses containing the image URL or path, followed by an optional quoted title

#### Reference Images

The reference form is `![alt text][id]`.

Code:

    [img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp  "Optional title attribute"
    ![Alt text][img id]

Preview:

---

[img id]: https://s2.loli.net/2024/08/20/5fszgXeOxmL3Wdv.webp "Optional title attribute"

![Alt text][img id]

---

<a id="strikethrough"></a>
### Strikethrough

HTML tag: `<del>`

Strikethrough is an extension to standard Markdown.

GFM adds it with pairs of tildes.

Code:

```
~~Mistaken text.~~
```

Preview:

---

~~Mistaken text.~~

---

<a id="miscellaneous"></a>
## Miscellaneous

<a id="automatic-links"></a>
### Automatic Links

Markdown provides a shortcut for URLs and email addresses: wrap the address in angle brackets.

Code:

    <http://example.com/>

    <address@example.com>

Preview:

---

<http://example.com/>

<address@example.com>

---

GFM also recognizes standard URLs and converts them into links automatically.

Code:

```
https://github.com/emn178/markdown
```

Preview:

---

https://github.com/emn178/markdown

---

<a id="backslash-escapes"></a>
### Backslash Escapes

A backslash escapes characters that would otherwise be interpreted as Markdown syntax, allowing them to appear literally.

Code:

    \*literal asterisks\*

Preview:

---

\*literal asterisks\*

---

The following characters can be escaped with a backslash:

Code:

    \   backslash
    `   backtick
    *   asterisk
    _   underscore
    {}  curly braces
    []  square brackets
    ()  parentheses
    #   hash mark
    +   plus sign
    -   minus sign (hyphen)
    .   dot
    !   exclamation mark

<a id="inline-html"></a>
## Inline HTML

When Markdown has no syntax for the markup you need, write native HTML directly. There is no special mode switch; just add the tags in place.

Code:

    This is a regular paragraph.

    <table>
        <tr>
            <td>Foo</td>
        </tr>
    </table>

    This is another regular paragraph.

Preview:

---

This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.

---

Markdown syntax is **not processed inside block-level HTML tags**.

It **is processed inside inline HTML tags**.

Code:

    <span>**Work**</span>

    <div>
        **No Work**
    </div>

Preview:

---

<span>**Work**</span>

<div>
  **No Work**
</div>
***

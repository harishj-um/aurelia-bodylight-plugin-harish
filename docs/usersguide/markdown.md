# Markdown syntax components

## BdlMarkdownnav
`<bdl-markdownnav src=""></bdl-markdownnav>"` renders navigation menu based on MD list. MD should contain only list.
All links should


## BdlMarkdown
`<bdl-markdown src="[filename.md]" watchhash="true|false"></bdl-markdown>` renders markdown - which may contain all the above webcomponents.
* `watchhash` if specified, then parameter in URL after hash is scanned and taken loaded instead `src`. The changes in hash are listened and document is replaced on change.
* `fromid` optional, if specified the DOM element with id `fromid` is listened to customevent `concentupdate` and event.detail.content is then parsed and output is updated.
* as aurelia component, the eventaggregator is subscribed to `ContentUpdate` - if any such message is received, then the content is rendered and output updated.

BdlMarkdown-it is used to render markdown with following plugins enabled: 
* highlight.js to highlight source code specifying language, e.g. Python 
 ```markdown
    ```javascript
     // some javascript code
    ``` 
```

```markdown
    ```python
    //some python code
    ```
```
* markdown-it-katex to render math formula between `$` or multiline `$$` using KaTEX and HTML.

Example:
```markdown
  Pythagoran theorem is $a^2 + b^2 = c^2$ and 
$$
c = \sqrt{a^2+b^2}
$$  
  
```
is rendered as:

  Pythagoran theorem is $a^2 + b^2 = c^2$ and 
$$
c = \sqrt{a^2+b^2}
$$



* markdown-it-footnote: 
```markdown
some text and reference [^1] some other text ^[inline footnote]

[^1]: footnote content
```

* markdown-it-attr: add class attribute or custom attribute
```markdown
paragraph *style me*{.red} more text
# header {num=4}
```

* customized markdown-it-btoc: add numbering and toc 1. 2. 3. 
```markdown
# header 
# second header
# third header
```

* markdown-it-btoc with specific number: will start from num=xx, e.g. 4 from 4. 5. 6.
```markdown
# header {num=4}
# fifth header
# sixth header
```
 

## markdown nav
`<bdl-markdownnav>` renders navigation

## markdown book, markdown-book2, markdown app
`<bdl-markdown-book>` renders vertical navigation sidebar on the left,
  * `index` - index MD to be shown as content
  * `summary` - navigation MD - navigation sidebar is rendered per list in it

`<bdl-markdown-book2>` renders vertical navigation sidebar on the left,
  * `index` - index MD to be shown as content
  * `summary` - navigation MD - navigation sidebar is rendered per list in it

`<bdl-markdown-app>` renders horizontal navigation menu on top
  * `index` - index MD to be shown as content
  * `summary` - navigation MD - navigation sidebar is rendered per list in it

# demo markdown input
```
<bdl-markdown-input id="id7"></bdl-markdown-input>
<bdl-markdown fromid="id7"></bdl-markdown>
```

<bdl-markdown-input id="id7"></bdl-markdown-input>
<bdl-markdown fromid="id7"></bdl-markdown>

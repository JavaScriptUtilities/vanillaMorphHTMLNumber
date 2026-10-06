# vanillaMorphHTMLNumber

This script adds a counter animation to an element. No library dependency.

## Usage

```html
<script src="js/morphhtmlnumber.min.js"></script>
```

### Basic

```html
<span id="counter">100</span>
<script>new morphHTMLNumber(document.getElementById('counter'));</script>
```

### Using attributes

```html
<span id="counter" data-finalvalue="142.42" data-morphtime="3000" data-morphisfloat="1"></span>
<script>new morphHTMLNumber(document.getElementById('counter'));</script>
```

### Using arguments

```js
new morphHTMLNumber({
    el: document.getElementById('counter'),
    finalValue: 42.42,
    time: 1000,
    waitUntilVisible: true
});
```

### Keeping format

Animates the first number of the value, keeping prefix, suffix, thousands and decimal separators.

```html
<span id="counter" data-morphkeepformat="1">80 000</span> <!-- 0 → 80 000 -->
<span id="counter-2" data-morphkeepformat="1">1,5m€</span> <!-- 0,0m€ → 1,5m€ -->
```

## Options

| Option | Attribute | Default | Description |
|---|---|---|---|
| `finalValue` | `data-finalvalue` | element content | Value to reach |
| `startValue` | `data-startvalue` | `0` (`100` if reverse) | Starting value |
| `time` | `data-morphtime` | `1500` | Animation duration (ms) |
| `intervalDelay` | `data-morphintervaldelay` | `25` | Delay between frames (ms) |
| `isFloat` | `data-morphisfloat` | `false` | Display decimals |
| `nbDecimals` | `data-morphnbdecimals` | `2` | Number of decimals if float |
| `isReverse` | `data-morphisreverse` | `false` | Count down from 100 by default |
| `waitUntilVisible` | `data-morphwaituntilvisible` | `false` | Start when the element enters the viewport |
| `keepFormat` | `data-morphkeepformat` | `false` | Keep text & number format around the animated number |

## Build

```sh
npm install && npm run build
```

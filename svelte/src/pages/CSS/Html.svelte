<!-- Javascript -->
<script>

  // Import Components
  import Icon from '../../components/Icon.svelte'

</script>

<!-- Headings and Paragraphs -->
<section>
  <h1>Heading h1</h1>
  <p>
    Paragraph of text...
    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
    Dolore doloribus nobis error repellat vitae, sit quasi 
    earum eveniet necessitatibus architecto alias officia 
    nemo accusamus ratione, delectus sint aut porro nam.
  </p>
  <br>
  <div>
    <h2>Smaller Heading h2</h2>
    <h6>Sub heading h6</h6>
  </div>
  <br>
  <h3>Heading h3</h3>
  <br>
  <h4>Heading h4</h4>
  <br>
  <h5>Sub Heading h5</h5>
</section>

<hr>

<!-- Text decoration -->
<section>
  <div>
    <h2>Decoration</h2>
    <h6>Italic, Bold, Underline, Strikethrough, and Highlight text</h6>
  </div>
  <div class="flex">
    <span> <i>Italic text</i> </span>
    <span> <b>Bold text</b> </span>
    <span> <u>Underline text</u> </span>
    <span> <s>Strikethrough text</s> </span>
    <span> <q>Quote text</q> </span>
    <span> <a href="/#">Anchor / Link</a> </span>
    <span> Highlight <mark>text</mark> </span>
    <span> 2<sup>16</sup> </span>
    <span> A<sub>b</sub> </span>
  </div>
</section>

<hr>

<!-- Block Text -->
<section>
  <div>
    <h2>Block Text</h2>
    <h6>Code, Pre-Code, and Blockquote examples</h6>
  </div>
  <p>
    <span>Here is a code block</span>
    <code>const app = document.getElementById('app')</code>
  </p>
  <div>
  <pre><code>{
`// Sort by id
array.sort(function (a, b) {
  let x = a.id.toLowerCase();
  let y = b.id.toLowerCase();
  if (x < y) {return 1;}
  if (x > y) {return -1;}
  return 0;
});`
  }</code></pre>
  </div>
  <blockquote>
    <p class="indent">
      In the beginning the Universe was created. 
      This has made a lot of people very angry 
      and has been widely regarded as a bad move.
    </p>
    <cite>Douglas Adams</cite>
  </blockquote>
</section>

<hr>

<!-- Lists -->
<section>
  <h2>Lists</h2>
  <ol>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ol>
  <ul>
    <li>List Item</li>
    <li>List Item with sub points
      <ul>
        <li>List Item</li>
        <li>List Item</li>
      </ul>
    </li>
    <li>List Item with text that wraps to the next line if the width is small enough</li>
    <li>Last List Item
      <ol>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ol>
    </li>
  </ul>
  <dl>
    <dt>Term</dt>
      <dd>Detail 1</dd>
      <dd>Detail 2</dd>
    <dt>Term</dt>
      <dd>Detail 1 with text that wraps to the next line if the width is small enough</dd>
      <dd>Detail 2</dd>
  </dl>
</section>

<hr>

<!-- Tables -->
<section>
  <h2>Tables</h2>
  <div style="overflow-x: auto">
    <table>
      <thead>
        <tr>
          <th>Heading 1</th>
          <th>Heading 2</th>
          <th>Heading 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Row 1, Data 1</td>
          <td>Row 1, Data 2</td>
          <td>Row 1, Data 3</td>
        </tr>
        <tr>
          <td>Row 2, Data 1</td>
          <td>Row 2, Data 2</td>
          <td>Row 2, Data 3</td>
        </tr>
        <tr>
          <td>Row 3, Data 1</td>
          <td>Row 3, Data 2</td>
          <td>Row 3, Data 3</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div style="overflow-x: auto">
    <table style="width: 100%;">
      <thead>
        <tr><th>Symbol</th><th>Dec</th><th>Hex</th><th>Binary</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td>A</td><td>65</td><td>41</td><td>1000001</td><td>Uppercase A</td></tr>
        <tr><td>B</td><td>66</td><td>42</td><td>1000010</td><td>Uppercase B</td></tr>
        <tr><td>C</td><td>67</td><td>43</td><td>1000011</td><td>Uppercase C</td></tr>
        <tr><td>D</td><td>68</td><td>44</td><td>1000100</td><td>Uppercase D</td></tr>
        <tr><td>E</td><td>69</td><td>45</td><td>1000101</td><td>Uppercase E</td></tr>
        <tr><td>F</td><td>70</td><td>46</td><td>1000110</td><td>Uppercase F</td></tr>
      </tbody>
    </table>
  </div>
</section>

<hr>

<!-- Buttons / Range -->
<section>
  <h2>Buttons</h2>
  <div class="flex">
    <button>Button Tag</button>
    <button disabled>Button disabled</button>
    <input type="button" value="Button Type">
    <input type="reset" value="Reset Type">
    <input type="submit" value="Submit Type">
    <input type="file">
  </div>
</section>

<hr>

<!-- Inputs -->
<section>
  <h2>Inputs</h2>
  <div>
    <label>
      Text Type <br>
      <input type="text" placeholder="placeholder...">
    </label>
  </div>
  <div>
    <label>
      Password Type <br>
      <input type="password" placeholder="password...">
    </label>
  </div>
  <div>
    <label>
      Number Type <br>
      <input type="number" placeholder="420...">
    </label>
  </div>
  <div>
    <label>
      Date <br>
      <input type="date">
    </label>
  </div>
  <div>
    <label>
      Time <br>
      <input type="time">
    </label>
  </div>
  <div>
    <label>
      Select <br>
      <select>
        <optgroup label="Optgroup 1">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </optgroup>
        <optgroup label="Optgroup 2">
          <option>Option 1</option>
          <option>Option 2 with extra text</option>
          <option>Option 3</option>
        </optgroup>
      </select>
    </label>
  </div>
  <div>
    <label>
      Textarea <br>
      <textarea>Test</textarea>
    </label>
  </div>
</section>

<hr>

<!-- Checkbox / Radio -->
<section>
  <h2>Checkbox / Radio</h2>
  <div>
    <input type="checkbox" name="chxSet1" id="chx1">
    <label for="chx1">Not Checked</label>
  </div>
  <div>
    <input type="checkbox" name="chxSet1" id="chx2" checked>
    <label for="chx2">Checked</label>
  </div>
  <div>
    <input type="checkbox" name="chxSet1" id="chx3" disabled>
    <label for="chx3">Disabled</label>
  </div>
  <div>
    <input type="checkbox" name="chxSet1" id="chx4" disabled checked>
    <label for="chx4">Disabled and Checked</label>
  </div>
  <br>
  <div>
    <input type="radio" name="radioSet1" id="rad1">
    <label for="rad1">Not Checked</label>
  </div>
  <div>
    <input type="radio" name="radioSet1" id="rad2" checked>
    <label for="rad2">Checked</label>
  </div>
  <div>
    <input type="radio" name="radioSet2" id="rad3" disabled>
    <label for="rad3">Disabled</label>
  </div>
  <div>
    <input type="radio" name="radioSet2" id="rad4" disabled checked>
    <label for="rad4">Disabled and Checked</label>
  </div>
</section>

<hr>

<!-- Details -->
<section>
  <h2>Details</h2>
  <details>
    <summary>Details</summary>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique in 
    laboriosam incidunt at explicabo reprehenderit dolores. Eveniet, 
    exercitationem sequi quis explicabo iure laudantium veritatis, aliquid 
    odio, molestiae nulla assumenda pariatur.
  </details>
</section>

<!-- Footer -->
<footer>
  <section class="width-sm center">
    <p>7-28-2022</p>
  </section>
</footer>

<!-- CSS -->
<style>
  section {
    padding: var(--gap);
    max-width: 1200px;
    margin: auto;
    display: grid;
    gap: var(--gap);
  }
  .flex {
    display: flex;
    gap: var(--gap);
    flex-wrap: wrap;
  }
</style>
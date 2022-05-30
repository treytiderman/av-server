


const selectNic = document.getElementById('selectNic');
selectNic.focus();


const dhcpPreset = document.getElementById('dhcpPreset');
const presetCards = document.getElementById('presetCards');
let presets = [...presetCards.children];
presets.push(dhcpPreset);


for (let i = 0; i < presets.length; i++) {
  const preset = presets[i];
  preset.addEventListener("click", () => {
    for (let i = 0; i < presets.length; i++) {
      presets[i].classList = 'grid t-l gap-0 w10 w30-bdr';
    }
    preset.classList = 'grid t-l gap-0 w10 w70-bdr checked';
  });
}













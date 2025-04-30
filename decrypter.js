const cipherForm = document.getElementById('cipher-form');

const resultOutput = document.getElementById('ciphered-text');

const cipherSelection = document.getElementById('cipher-type');

const autoCipher = document.getElementById('auto-cipher');

const submitBtn = document.getElementById('cipher-submit');

// caesarCipher where "str" can be plainText or cipherText, "rotNum" is the initial shifted ascii value, "rotNum" is "incremented" for each character in the original string.
const caesarCipher = (str, rotNum = 1, increment = 0) => {
  const starTime = performance.now();
  // cast to Numbers to prevent negative number encoding issues
  rotNum = Number(rotNum);
  increment = Number(increment);

  // string to lower-case for ease of debugging
  str = str.toLowerCase();

  let strCode = [];
  // add all characters as ascii values to asciiChars
  for (let i = 0; i < str.length; i++) {
    strCode.push(str.charCodeAt(i))
  }
  
  // DEBUG: string -> code array
  // console.log(strCode);

  const result = strCode.map(charCode => {
    // lower case alphabet code value range from 97-122
    const alphaStart = 'a'.charCodeAt(0);
    const alphaRange = 'z'.charCodeAt(0) - alphaStart + 1;

    
    if (charCode < 97 | charCode > 122) {
      if (charCode == '*'.charCodeAt(0)) {
        // if character is asterisk increment cipher without rotating character
        rotNum += increment
      }
      // if character is not lowercase alphabet return as original character
      return String.fromCharCode(charCode);
    } else {
      // if character is lower case apha, shift it in the corresponding rotation
      // flatten ascii value to 0-25
      charCode -= alphaStart;
      // shift characters ascii code within alphabet range (using mod 26)
      charCode = (((charCode + rotNum) % alphaRange) + alphaRange) % alphaRange;
      // expand back to ascii alphabet value range
      charCode += alphaStart;
      // increement rotation value
      rotNum += increment;
      // return modified charCode
      return String.fromCharCode(charCode);
    }
  })
  // performance test
  // console.log(`caesar cipher execution took: %c${performance.now() - starTime}`, 'color: lightgreen');
  return result.join("");
}

// test ciphered text
const originalText = 'Uq wlj yjwddd mzccw kzx pdjbq, Xov cui yu pveod*vu*jv lay m*flr au vki bkz*nby qqut. Jywky vnb qhg*u w*fz hvxd*qe dph*q lyz*p rn ax*nis zomv. Sq fu*h yj uhhaeokdd, zqx qzya iuocf gvt Ei*xl dijccibvhpd. Cl kjxyag oabfo mbz lxqs tp thtjga. Aqyfxq kt hv*xcqa km qeqnb, my cptu lp fnytd rk viibfplaukrr tl apn dsdroi. Ye lauo yxqd, tig Rvik* ervw mph ie uwlnmkv rge tkwi ftk bqydq jvd ivwd nj wysre jv. Gs sua lnvlk. Fhddv jxgziycqs. Gkui kuyondd.';

const test = () => {
  return caesarCipher(originalText, -1, -1);
}

const saveInput = (target) => {
  let value = target.value;
  if (target.type == "checkbox") {
    value = target.checked;
  }
  localStorage.setItem(target.id, value);
}

const handleInput = (event) => {
  const target = event.target;
  saveInput(target);

  switch (target.id) {
    case 'cipher-type':
      handleCipher();
  }
  
  handleAutoCipher();
}

const handleAutoCipher = () => {
  if (autoCipher.checked)  {
    submitBtn.style.display = "none";
    handleSubmit();
  } else {
    submitBtn.style.display = "block";
  }
}

const handleSubmit = (event) => {
  event && event.preventDefault();
  switch (cipherSelection.value) {
    case 'caesar':
      // get original text
      const originalText = document.getElementById('original-text').value;
      // get params for caesar cipher
      const rotNum = document.getElementById('rotation-number').value;
      const increment = document.getElementById('rotation-increment').value;
      const result = caesarCipher(originalText, rotNum, increment);
      // log (d)encoded text for debugging
      // console.log(result);
      resultOutput.innerText = result;
    default:
  }
}

const handleCipher = () => {
  const cipherSelectSection = cipherSelection.parentNode;
  // remove children of cipherForm after cipherSelection
  while (cipherSelectSection.nextSibling) {
    cipherSelectSection.nextSibling.remove();
  }

  switch (cipherSelection.value) {
    case "caesar":
      // create input for rotation parameter 
      const rotNumLabel = document.createElement('label');
      rotNumLabel.setAttribute('for', 'rotation-number');
      rotNumLabel.innerText = "Caesar Initial Rotation";
      const rotNumInput = document.createElement('input');
      rotNumInput.setAttribute('id', 'rotation-number');
      rotNumInput.setAttribute('type', 'number');
      rotNumInput.value = localStorage.getItem(rotNumInput.id) ?? 1;
      rotNumLabel.appendChild(rotNumInput);

      // create input for steps/increment parameter
      const incrementLabel = document.createElement('label');
      incrementLabel.setAttribute('for', 'rotation-increment');
      incrementLabel.innerText = "Caesar Rotation Increment";
      const incrementInput = document.createElement('input');
      incrementInput.setAttribute('id', 'rotation-increment');
      incrementInput.setAttribute('type', 'number');
      incrementInput.value = localStorage.getItem(incrementInput.id) ?? 0;
      incrementLabel.appendChild(incrementInput);

      // create label for cipher parameter inputs
      const paramInputs = document.createElement('label',);
      paramInputs.style = "text-align: center";
      paramInputs.innerText = "Caesar Cipher Params";

      cipherForm.appendChild(paramInputs);
      cipherForm.appendChild(rotNumLabel);
      cipherForm.appendChild(incrementLabel);

      handleAutoCipher();
      break;
    default:
  }
}

// onLoad
// prefill from localStorage
for (let i = 0; i < localStorage.length; i++) {
  const elemId = localStorage.key(i);
  const element = document.getElementById(elemId);
  if (element) {
    if (element.type == "checkbox") {
      element.checked = JSON.parse(localStorage.getItem(elemId));
    } else {
      element.value = localStorage.getItem(elemId);
    }
  }
}
handleCipher();
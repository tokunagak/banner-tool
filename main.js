'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const inputImg = document.querySelector('#input-img');
    const imgElement = document.querySelector('#img');
    const displayImages = document.querySelectorAll('.dis-img'); // 複数のdis-img要素を取得

    const inputBgImage = document.querySelector('#input-bgImage');
    const bgImgElement = document.querySelector('#bg-img');
    const displayBodies = document.querySelectorAll('.bl_display_body'); // 複数のbl_display_body要素を取得

    // 画像が選択された場合の処理
    inputImg.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageSrc = event.target.result;
            imgElement.src = imageSrc;
            inputImg.classList.add('d-none'); // 画像が設定されたら非表示

            // 複数のdis-img要素に同じ画像を設定
            displayImages.forEach((disImg) => {
                disImg.src = imageSrc;
            });
        };
        reader.readAsDataURL(file);
    });

    // 画像がクリアされた場合の処理
    imgElement.addEventListener('dblclick', () => {
        imgElement.src = '';
        inputImg.classList.remove('d-none'); // 画像が削除されたら表示
        inputImg.value = ''; // ファイル入力をクリア

        // 複数のdis-img要素もクリア
        displayImages.forEach((disImg) => {
            disImg.src = '';
        });
    });

    // 背景画像の設定処理
    inputBgImage.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageSrc = event.target.result;
            bgImgElement.src = imageSrc; // リアルタイムで#bg-imgのsrcに反映

            // 複数のbl_display_bodyの背景画像を設定
            displayBodies.forEach((body) => {
                body.style.backgroundImage = `url(${imageSrc})`;
            });
        };
        reader.readAsDataURL(file);
    });

    // 背景画像のクリア処理 (ダブルクリックで画像を削除)
    bgImgElement.addEventListener('dblclick', () => {
        bgImgElement.src = ''; // bg-imgの画像を削除
        inputBgImage.value = ''; // input-bgImageをリセット

        // 複数のbl_display_bodyの背景画像もクリア
        displayBodies.forEach((body) => {
            body.style.backgroundImage = ''; // 背景画像をクリア
        });
    });

    // 高さをアスペクト比16:5に調整
    const adjustHeight = () => {
        const boxes = document.querySelectorAll('.bl_display_body');
        boxes.forEach((box) => {
            box.style.height = `${box.offsetWidth / (16 / 5)}px`;
        });
    };

    window.addEventListener('load', adjustHeight);
    window.addEventListener('resize', adjustHeight);

    // タイトル・サブタイトル・色のリアルタイム反映
    handleInputChange('#input-ttl', '.bl_display_ttl', 'text');
    handleInputChange('#input-sub', '.bl_display_subTtl', 'text');
    handleInputChange('#input-color', '.bl_display_color > span', 'backgroundColor');
});

// 汎用的な入力変更ハンドラ関数
function handleInputChange(inputSelector, targetSelector, type) {
    const inputElement = document.querySelector(inputSelector);
    const targetElements = document.querySelectorAll(targetSelector);

    inputElement.addEventListener('input', function () {
        const value = this.value;

        targetElements.forEach((target) => {
            if (type === 'text') {
                target.textContent = value;
            } else if (type === 'backgroundColor') {
                target.style.backgroundColor = value;
            }
        });
    });
}

// -----------------------------------------------------------------------------------
// バナーをダウンロードする処理
function downloadBanner(targetId, filename) {
    const targetElement = document.querySelector(`#${targetId} .bl_display_body`);

    html2canvas(targetElement, { scale: 3 }).then(canvas => {
        // const resizedCanvas = resizeCanvas(canvas, 2360, 700);
        const resizedCanvas = resizeCanvas(canvas, 1180, 350);
        saveCanvasAsImage(resizedCanvas, filename);
    });
}

// キャンバスをリサイズする関数
function resizeCanvas(canvas, width, height) {
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    const ctx = resizedCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0, width, height);
    return resizedCanvas;
}

// キャンバスを画像として保存する関数
function saveCanvasAsImage(canvas, filename) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
}

// バナー1とバナー2のダウンロードリンクに対してイベントを追加
document.getElementById('download-bn1').addEventListener('click', function(event) {
    event.preventDefault();
    downloadBanner('banner-1', 'banner1_2360x700.png');
});

document.getElementById('download-link-bn2').addEventListener('click', function(event) {
    event.preventDefault();
    downloadBanner('banner-2', 'banner2_2360x700.png');
});

// -----------------------------------------------------------------------------------
// 言語判別関数
function detectLanguage(text) {
    const englishRegex = /^[A-Za-z\s]+$/; // 英語
    const thaiRegex = /[\u0E00-\u0E7F]/; // タイ語

    if (englishRegex.test(text)) {
        return '英語';
    } else if (thaiRegex.test(text)) {
        return 'タイ語';
    } else {
        return 'その他の言語';
    }
}

// 言語に基づいてフォントを設定する関数
function updateFontBasedOnLanguage(inputId, displayClass) {
    const inputElement = document.getElementById(inputId);
    const displayElements = document.querySelectorAll(displayClass);

    inputElement.addEventListener('input', function () {
        const detectedLanguage = detectLanguage(this.value);
        let fontFamily = '';

        if (detectedLanguage === '英語') {
            fontFamily = 'A-OTF Shin Go Pro R';
        } else if (detectedLanguage === 'タイ語') {
            fontFamily = 'Sukhumvit';
        }

        displayElements.forEach(el => {
            el.style.fontFamily = fontFamily;
            el.textContent = this.value;
        });
    });
}

// タイトルとサブタイトルの入力欄を監視して言語判定を行う
updateFontBasedOnLanguage('input-ttl', '.bl_display_ttl');
updateFontBasedOnLanguage('input-sub', '.bl_display_subTtl');

// -----------------------------------------------------------------------------------
// フォントサイズを更新する関数
function updateFontSize(inputId, targetClass) {
    const inputElement = document.getElementById(inputId);
    const targetElements = document.querySelectorAll(targetClass);

    inputElement.addEventListener('input', function () {
        const fontSizePx = parseFloat(this.value);
        if (!isNaN(fontSizePx) && fontSizePx > 0) {
            const fontSizeRem = fontSizePx / 16;
            targetElements.forEach(el => {
                el.style.fontSize = `${fontSizeRem}rem`;
            });
        }
    });
}

// タイトルとサブタイトルのフォントサイズを監視して変更
updateFontSize('fz-ttl', '.bl_display_ttl');
updateFontSize('fz-subTtl', '.bl_display_subTtl');

// -----------------------------------------------------------------------------------
// オプションに切り替える
document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.querySelector('#input-selOp'); // <select> 要素を取得
    const displayBodies = document.querySelectorAll('.bl_display_body'); // 複数の .bl_display_body を取得
    const spans = document.querySelectorAll('.bl_display_color > span'); // 複数の .bl_display_color > span を取得

    // 動的に select 要素の配下にある option の value を取得
    const classValues = Array.from(selectElement.options).map(option => option.value);

    // select の変更イベントを監視
    selectElement.addEventListener('change', () => {
        const selectedValue = selectElement.value; // 選択された value を取得

        // "original" が選択された場合はクラスを何も付与しない
        if (selectedValue === 'original') {
            // すべてのクラスを削除
            displayBodies.forEach(body => {
                body.classList.remove(...classValues); // 配列内のすべてのクラスを削除
            });

            // span 要素の d-none クラスを削除
            spans.forEach(span => {
                span.classList.remove('d-none');
            });
        } else {
            // "mitsu", "makita" などが選択された場合
            displayBodies.forEach(body => {
                // 他のクラスを削除し、選択されたクラスを追加
                body.classList.remove(...classValues); // 配列内のすべてのクラスを削除
                body.classList.add(selectedValue); // 選択された value を追加
            });

            // span 要素に d-none クラスを付与して非表示
            spans.forEach(span => {
                span.classList.add('d-none');
            });
        }
    });
});


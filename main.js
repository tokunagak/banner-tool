'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // const inputImg = document.querySelector('#input-img');
    // const imgElement = document.querySelector('#img');

    // inputImg.addEventListener('change', (event) => {
    //     const file = event.target.files[0];
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //         imgElement.src = event.target.result;
    //         inputImg.classList.add('d-none'); // 画像が設定されたら、input-imgにd-noneクラスを付与
    //     };
    //     reader.readAsDataURL(file);
    // });

    // imgElement.addEventListener('click', () => {
    //     imgElement.src = ''; 
    //     inputImg.classList.remove('d-none'); // 画像が削除されたら、d-noneクラスを削除
    //     inputImg.value = ''; // input type="file" のファイルをリセット
    // });

    // const adjustHeight = () => {
    //     const boxes = document.querySelectorAll('.bl_display_body');
    //     boxes.forEach((box) => {
    //         const aspectRatio = 16 / 5;
    //         box.style.height = `${box.offsetWidth / aspectRatio}px`;
    //     });
    // };

    const inputImg = document.querySelector('#input-img');
    const imgElement = document.querySelector('#img');
    const displayImages = document.querySelectorAll('.dis-img'); // 複数のdis-img要素を取得


    inputImg.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        // reader.onload = (event) => {
        //     imgElement.src = event.target.result;
        //     disImgElement.src = event.target.result; // 追加: 同じ画像を #dis-img にも表示
        //     inputImg.classList.add('d-none'); // 画像が設定されたら、input-imgにd-noneクラスを付与
        // };
        // reader.readAsDataURL(file);
        reader.onload = (event) => {
            imgElement.src = event.target.result;
            inputImg.classList.add('d-none'); // 画像が設定されたら、input-imgにd-noneクラスを付与

            // 複数のdis-img要素に対して同じ画像を設定
            displayImages.forEach((disImg) => {
                disImg.src = event.target.result; // img要素と同じ画像を設定
            });
        };
        reader.readAsDataURL(file);
    });

    imgElement.addEventListener('click', () => {
        imgElement.src = ''; 
        // disImgElement.src = ''; // 追加: #dis-img の画像も削除
        inputImg.classList.remove('d-none'); // 画像が削除されたら、d-noneクラスを削除
        inputImg.value = ''; // input type="file" のファイルをリセット
        // 複数のdis-img要素の画像もリセット
        displayImages.forEach((disImg) => {
            disImg.src = ''; // 画像をクリア
        });
    });

    const adjustHeight = () => {
        const boxes = document.querySelectorAll('.bl_display_body');
        boxes.forEach((box) => {
            const aspectRatio = 16 / 5;
            box.style.height = `${box.offsetWidth / aspectRatio}px`;
        });
    };


    window.addEventListener('load', adjustHeight);
    window.addEventListener('resize', adjustHeight);
// -------------------------------------------------------------------------------
    // タイトルの入力があったら、複数の .bl_display_ttl に反映
    document.querySelector('#input-ttl').addEventListener('input', function() {
        const titleElements = document.querySelectorAll('.bl_display_ttl'); // 複数の要素を取得
        titleElements.forEach((el) => {
          el.textContent = this.value; // 各要素に入力された値を反映
        });
    });

    // サブタイトルの入力があったら反映
    document.querySelector('#input-sub').addEventListener('input', function() {
        document.querySelector('.bl_display_subTtl').textContent = this.value;
    });

    document.querySelector('#input-color').addEventListener('input', function() {
        const titleElements = document.querySelectorAll('.bl_display_color > span'); // 複数の要素を取得
        titleElements.forEach((el) => {
          el.style.backgroundColor = this.value; // 各要素に入力された値を反映
        });
    });
});

// -----------------------------------------------------------------------------------
function downloadBanner(targetId, filename) {
    const targetElement = document.querySelector(`#${targetId} .bl_display_body`);

    html2canvas(targetElement, { scale: 3 }).then(canvas => {
        const resizedWidth = 2360;
        const resizedHeight = 700;

        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = resizedWidth;
        resizedCanvas.height = resizedHeight;
        const ctx = resizedCanvas.getContext('2d');

        ctx.drawImage(canvas, 0, 0, resizedWidth, resizedHeight);

        const link = document.createElement('a');
        link.href = resizedCanvas.toDataURL('image/png');
        link.download = filename;
        link.click();
    });
}

  // バナー1のダウンロードリンク
document.getElementById('download-bn1').addEventListener('click', function(event) {
    event.preventDefault();
    downloadBanner('banner-1', 'banner1_2360x700.png');
});

  // バナー2のダウンロードリンク
document.getElementById('download-link-bn2').addEventListener('click', function(event) {
    event.preventDefault();
    downloadBanner('banner-2', 'banner2_2360x700.png');
});
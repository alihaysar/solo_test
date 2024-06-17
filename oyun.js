class Konum {
    constructor(satir, sutun) {
        this.satir = satir;
        this.sutun = sutun;
    }
}

class Oyun {
    constructor(boyut) {
        this.boyut = boyut;
        this.tahta = Array.from({ length: boyut }, () => Array(boyut).fill('A'));
        this.rasgeleDiz();
        const merkez = Math.floor(boyut / 2);
        this.tahta[merkez][merkez] = ' ';
    }

    rasgeleDiz() {
        let k = 0;
        for (let i = 0; i < this.boyut; i++) {
            for (let j = 0; j < this.boyut; j++) {
                this.tahta[i][j] = 'A';
                k++;
            }
        }
    }

    hamleGecerliMi(baslangic, hedef) {
        if (baslangic.satir < 0 || baslangic.satir >= this.boyut || baslangic.sutun < 0 || baslangic.sutun >= this.boyut) {
            return false;
        }

        if (hedef.satir < 0 || hedef.satir >= this.boyut || hedef.sutun < 0 || hedef.sutun >= this.boyut) {
            return false;
        }

        if (this.tahta[baslangic.satir][baslangic.sutun] === ' ') {
            return false;
        }

        if (this.tahta[hedef.satir][hedef.sutun] !== ' ') {
            return false;
        }

        if (baslangic.satir !== hedef.satir && baslangic.sutun !== hedef.sutun) {
            return false;
        }

        if (baslangic.satir === hedef.satir) {
            const minSutun = Math.min(baslangic.sutun, hedef.sutun);
            if (Math.abs(baslangic.sutun - hedef.sutun) !== 2 || this.tahta[baslangic.satir][minSutun + 1] === ' ') {
                return false;
            }
        } else if (baslangic.sutun === hedef.sutun) {
            const minSatir = Math.min(baslangic.satir, hedef.satir);
            if (Math.abs(baslangic.satir - hedef.satir) !== 2 || this.tahta[minSatir + 1][baslangic.sutun] === ' ') {
                return false;
            }
        }

        return true;
    }

    hamleYap(baslangic, hedef) {
        if (this.hamleGecerliMi(baslangic, hedef)) {
            if (baslangic.satir === hedef.satir) {
                const minSutun = Math.min(baslangic.sutun, hedef.sutun);
                this.tahta[baslangic.satir][minSutun + 1] = ' ';
            } else {
                const minSatir = Math.min(baslangic.satir, hedef.satir);
                this.tahta[minSatir + 1][baslangic.sutun] = ' ';
            }

            this.tahta[hedef.satir][hedef.sutun] = this.tahta[baslangic.satir][baslangic.sutun];
            this.tahta[baslangic.satir][baslangic.sutun] = ' ';
        }
    }

    oyunBittiMi() {
        for (let i = 0; i < this.boyut; i++) {
            for (let j = 0; j < this.boyut; j++) {
                if (this.tahta[i][j] !== ' ') {
                    const baslangic = new Konum(i, j);
                    if (this.hamleGecerliMi(baslangic, new Konum(i, j + 2)) ||
                        this.hamleGecerliMi(baslangic, new Konum(i, j - 2)) ||
                        this.hamleGecerliMi(baslangic, new Konum(i + 2, j)) ||
                        this.hamleGecerliMi(baslangic, new Konum(i - 2, j))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    kalanTasSayisi() {
        return this.tahta.flat().filter(cell => cell !== ' ').length;
    }

    oyunuBitir() {
        const kalanTas = this.kalanTasSayisi();
        if (kalanTas === 1) {
            alert("bilgin. Kalan taş sayısı: " + kalanTas);
        } else if (kalanTas === 2) {
            alert("zeki. Kalan taş sayısı: " + kalanTas);
        } else if (kalanTas === 3) {
            alert("başarılı. Kalan taş sayısı: " + kalanTas);
        } else if (kalanTas === 4) {
            alert("normal. Kalan taş sayısı: " + kalanTas);
        } else if (kalanTas === 5) {
            alert("beceriksiz. Kalan taş sayısı: " + kalanTas);
        } else if (kalanTas === 6) {
            alert("aptal. Kalan taş sayısı: " + kalanTas);
        } else if (kalanTas === 7) {
            alert("gerizekalı. Kalan taş sayısı: " + kalanTas);
        } else {
            alert("beyinsiz. Kalan taş sayısı: " + kalanTas);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const boyut = 5;
    const oyun = new Oyun(boyut);
    const board = document.getElementById("board");

    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < boyut; i++) {
            for (let j = 0; j < boyut; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = oyun.tahta[i][j];
                cell.addEventListener('click', () => selectPosition(i, j));
                board.appendChild(cell);
            }
        }
    }

    let baslangic = null;

    function selectPosition(i, j) {
        if (!baslangic) {
            baslangic = new Konum(i, j);
            board.children[i * boyut + j].classList.add('selected');
        } else {
            const hedef = new Konum(i, j);
            if (oyun.hamleGecerliMi(baslangic, hedef)) {
                oyun.hamleYap(baslangic, hedef);
                createBoard();
                if (oyun.oyunBittiMi()) {
                    oyun.oyunuBitir();
                }
            } else {
                alert("Geçersiz hamle. Tekrar deneyin.");
            }
            baslangic = null;
            createBoard();
        }
    }

    createBoard();
});

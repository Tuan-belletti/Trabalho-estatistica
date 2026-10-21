// Funções de apoio

// aceita vírgula e "inf" / "-inf"
function lerNumero(id) {
    let texto = document.getElementById(id).value.trim().replace(",", ".");

    if (texto == "inf" || texto == "+inf") {
        return Infinity;
    }
    if (texto == "-inf") {
        return -Infinity;
    }
    return parseFloat(texto);
}

// "20; 15; 7" -> [20, 15, 7]
function lerLista(id) {
    let partes = document.getElementById(id).value.split(";");
    let lista = [];

    for (let i = 0; i < partes.length; i++) {
        let valor = partes[i].trim().replace(",", ".");
        if (valor != "") {
            lista.push(parseFloat(valor));
        }
    }
    return lista;
}

function lerNomes(id) {
    let partes = document.getElementById(id).value.split(";");
    let lista = [];

    for (let i = 0; i < partes.length; i++) {
        let nome = partes[i].trim();
        if (nome != "") {
            lista.push(nome);
        }
    }
    return lista;
}

function mostrar(id, html) {
    document.getElementById(id).innerHTML = html;
}

function mostrarErro(id, mensagem) {
    mostrar(id, "<p class='erro'>" + mensagem + "</p>");
}

function formatar(numero, casas) {
    if (casas == undefined) {
        casas = 4;
    }
    return numero.toFixed(casas).replace(".", ",");
}

function porcentagem(numero) {
    return (numero * 100).toFixed(2).replace(".", ",") + "%";
}

function formatarLimite(numero) {
    if (numero == Infinity) {
        return "+∞";
    }
    if (numero == -Infinity) {
        return "-∞";
    }
    return String(numero).replace(".", ",");
}

// Fórmulas

function fatorial(n) {
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
        resultado = resultado * i;
    }
    return resultado;
}

// C(n, k), multiplicando aos poucos para não estourar
function combinacao(n, k) {
    if (k < 0 || k > n) {
        return 0;
    }
    let resultado = 1;
    for (let i = 1; i <= k; i++) {
        resultado = resultado * (n - k + i) / i;
    }
    return resultado;
}

// Binomial: P(X = k) = C(n, k) . p^k . (1 - p)^(n - k)
function binomial(k, n, p) {
    return combinacao(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Poisson: P(X = k) = e^(-lambda) . lambda^k / k!
function poisson(k, lambda) {
    return Math.exp(-lambda) * Math.pow(lambda, k) / fatorial(k);
}

// Hipergeométrica: P(X = x) = C(K, x) . C(N - K, n - x) / C(N, n)
function hipergeometrica(x, N, K, n) {
    return combinacao(K, x) * combinacao(N - K, n - x) / combinacao(N, n);
}

// Função erro (aproximação de Abramowitz e Stegun)
function erf(x) {
    let sinal = 1;
    if (x < 0) {
        sinal = -1;
        x = -x;
    }
    let t = 1 / (1 + 0.3275911 * x);
    let y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return sinal * y;
}

// P(X < x) na normal
function normalAcumulada(x, media, desvio) {
    if (x == Infinity) {
        return 1;
    }
    if (x == -Infinity) {
        return 0;
    }
    let z = (x - media) / desvio;
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

function normalEntre(a, b, media, desvio) {
    return normalAcumulada(b, media, desvio) - normalAcumulada(a, media, desvio);
}

// Probabilidade total e Bayes (P7 e P8)
function bayes(priori, taxa) {
    let total = 0;
    for (let i = 0; i < priori.length; i++) {
        total = total + priori[i] * taxa[i];
    }

    let posteriori = [];
    for (let i = 0; i < priori.length; i++) {
        posteriori.push(priori[i] * taxa[i] / total);
    }

    return { total: total, posteriori: posteriori };
}

// Gráficos (Chart.js)

let graficos = {};

function desenharGrafico(idCanvas, tipo, rotulos, valores, titulo) {
    // sem internet o Chart.js não carrega
    if (typeof Chart == "undefined") {
        return;
    }

    if (graficos[idCanvas]) {
        graficos[idCanvas].destroy();
    }

    // o canvas fica escondido até ter um gráfico
    let canvas = document.getElementById(idCanvas);
    canvas.style.display = "block";

    graficos[idCanvas] = new Chart(canvas, {
        type: tipo,
        data: {
            labels: rotulos,
            datasets: [{
                label: titulo,
                data: valores,
                backgroundColor: "#328cc1",
                borderColor: "#0b3c5d"
            }]
        }
    });
}

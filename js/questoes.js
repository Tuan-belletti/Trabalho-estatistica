// 1. Conjuntos

function gerarConjunto(tamanhoUniverso, quantidade) {
    let conjunto = [];
    while (conjunto.length < quantidade) {
        let numero = Math.ceil(Math.random() * tamanhoUniverso);
        if (!conjunto.includes(numero)) {
            conjunto.push(numero);
        }
    }
    conjunto.sort(function (a, b) { return a - b; });
    return conjunto;
}

function uniao(x, y) {
    let resultado = x.slice();
    for (let i = 0; i < y.length; i++) {
        if (!resultado.includes(y[i])) {
            resultado.push(y[i]);
        }
    }
    resultado.sort(function (a, b) { return a - b; });
    return resultado;
}

function intersecao(x, y) {
    let resultado = [];
    for (let i = 0; i < x.length; i++) {
        if (y.includes(x[i])) {
            resultado.push(x[i]);
        }
    }
    return resultado;
}

function complemento(x, tamanhoUniverso) {
    let resultado = [];
    for (let i = 1; i <= tamanhoUniverso; i++) {
        if (!x.includes(i)) {
            resultado.push(i);
        }
    }
    return resultado;
}

function escreverConjunto(nome, conjunto) {
    return "<p><b>" + nome + "</b> = { " + conjunto.join(", ") + " }  (" + conjunto.length + " elementos)</p>";
}

function questao1() {
    let universo = lerNumero("p1_universo");
    let tamA = lerNumero("p1_a");
    let tamB = lerNumero("p1_b");
    let tamC = lerNumero("p1_c");

    if (tamA > universo || tamB > universo || tamC > universo) {
        mostrarErro("r1", "Os conjuntos não podem ser maiores que o universo.");
        return;
    }

    let A = gerarConjunto(universo, tamA);
    let B = gerarConjunto(universo, tamB);
    let C = gerarConjunto(universo, tamC);

    let html = "<p>Universo U = {1, 2, ..., " + universo + "}</p>";
    html += escreverConjunto("A", A);
    html += escreverConjunto("B", B);
    html += escreverConjunto("C", C);
    html += "<hr>";
    html += escreverConjunto("1. A ∪ B", uniao(A, B));
    html += escreverConjunto("2. A ∩ B", intersecao(A, B));
    html += escreverConjunto("3. A ∩ C", intersecao(A, C));
    html += escreverConjunto("4. Aᶜ", complemento(A, universo));

    mostrar("r1", html);
}

// 2. Grupos (baralho)
function questao2() {
    let populacao = lerNumero("p2_populacao");
    let grupos = lerNumero("p2_grupos");
    let escolhido = lerNumero("p2_escolhido");

    if (populacao % grupos != 0) {
        mostrarErro("r2", "A população precisa ser dividida igualmente pelos grupos.");
        return;
    }
    if (escolhido < 1 || escolhido > grupos) {
        mostrarErro("r2", "O grupo escolhido deve estar entre 1 e " + grupos + ".");
        return;
    }

    let porGrupo = populacao / grupos;
    let pGrupo = porGrupo / populacao;
    let pNaoGrupo = 1 - pGrupo;

    let html = "<p>Elementos em cada grupo = " + populacao + " / " + grupos + " = " + porGrupo + "</p>";
    html += "<p>P(ser do grupo " + escolhido + ") = " + porGrupo + " / " + populacao + " = " + formatar(pGrupo) + "</p>";
    html += "<p class='resposta'>P(NÃO ser do grupo " + escolhido + ") = 1 - " + formatar(pGrupo) + " = "
        + formatar(pNaoGrupo) + " (" + porcentagem(pNaoGrupo) + ")</p>";

    mostrar("r2", html);
}

// 3. Seleção proporcional
function questao3() {
    let nomes = lerNomes("p3_nomes");
    let funcionarios = lerLista("p3_funcionarios");
    let alvo = document.getElementById("p3_alvo").value.trim();

    if (nomes.length != funcionarios.length) {
        mostrarErro("r3", "A quantidade de nomes e de funcionários tem que ser igual.");
        return;
    }
    if (!nomes.includes(alvo)) {
        mostrarErro("r3", "A empresa " + alvo + " não está na lista.");
        return;
    }

    let total = 0;
    for (let i = 0; i < funcionarios.length; i++) {
        total = total + funcionarios[i];
    }

    let probabilidades = [];
    let html = "<p>Total de funcionários = " + total + "</p>";
    html += "<p><b>a)</b> Probabilidade de cada empresa ser selecionada:</p>";
    html += "<table><tr><th>Empresa</th><th>Funcionários</th><th>Probabilidade</th></tr>";
    for (let i = 0; i < nomes.length; i++) {
        let p = funcionarios[i] / total;
        probabilidades.push(p);
        html += "<tr><td>" + nomes[i] + "</td><td>" + funcionarios[i] + " / " + total + "</td><td>"
            + formatar(p) + " (" + porcentagem(p) + ")</td></tr>";
    }
    html += "</table>";

    let pAlvo = probabilidades[nomes.indexOf(alvo)];
    html += "<p class='resposta'>b) P(empresa " + alvo + " NÃO ser selecionada) = 1 - " + formatar(pAlvo)
        + " = " + formatar(1 - pAlvo) + "</p>";

    mostrar("r3", html);
    desenharGrafico("g3", "bar", nomes, probabilidades, "Probabilidade de ser selecionada");
}

// 4. Sem reposição
function questao4() {
    let grupo = lerNumero("p4_grupo");
    let outros = lerNumero("p4_outros");
    let valoresN = lerLista("p4_n");
    let total = grupo + outros;

    let html = "<p>Total de estudantes = " + grupo + " + " + outros + " = " + total + "</p>";

    for (let i = 0; i < valoresN.length; i++) {
        let n = valoresN[i];
        if (n > grupo) {
            html += "<p>n = " + n + ": impossível, só existem " + grupo + " no grupo (probabilidade 0)</p>";
            continue;
        }

        // regra do produto: cada retirada tira um do grupo e do total
        let p = 1;
        let conta = "";
        for (let j = 0; j < n; j++) {
            p = p * (grupo - j) / (total - j);
            if (j > 0) {
                conta += " x ";
            }
            conta += (grupo - j) + "/" + (total - j);
        }

        html += "<p class='resposta'>n = " + n + ": P(todos do grupo) = " + conta + " = " + formatar(p)
            + " (" + porcentagem(p) + ")</p>";
        html += "<p class='dica'>Conferindo com combinação: C(" + grupo + "," + n + ") / C(" + total + "," + n + ") = "
            + formatar(combinacao(grupo, n) / combinacao(total, n)) + "</p>";
    }

    mostrar("r4", html);
}

// 5. Independentes
function questao5() {
    let nomes = lerNomes("p5_nomes");
    let probabilidades = lerLista("p5_probabilidades");

    if (nomes.length != probabilidades.length) {
        mostrarErro("r5", "A quantidade de nomes e de probabilidades tem que ser igual.");
        return;
    }

    let ninguem = 1;
    let html = "";
    for (let i = 0; i < nomes.length; i++) {
        html += "<p>P(" + nomes[i] + " NÃO resolver) = 1 - " + formatarLimite(probabilidades[i]) + " = "
            + formatar(1 - probabilidades[i], 2) + "</p>";
        ninguem = ninguem * (1 - probabilidades[i]);
    }

    let resolvido = 1 - ninguem;
    html += "<p>P(ninguém resolver) = " + formatar(ninguem) + "</p>";
    html += "<p class='resposta'>P(problema ser resolvido) = 1 - " + formatar(ninguem) + " = " + formatar(resolvido)
        + " (" + porcentagem(resolvido) + ")</p>";

    mostrar("r5", html);
}

// 6. Frequência relativa
function questao6() {
    let total = lerNumero("p6_total");
    let ocorrencias = lerNumero("p6_ocorrencias");

    if (ocorrencias > total) {
        mostrarErro("r6", "As ocorrências não podem ser maiores que o total.");
        return;
    }

    let p = ocorrencias / total;
    let html = "<p>P(exigir reparo) = " + ocorrencias + " / " + total + " = " + formatar(p) + "</p>";
    html += "<p class='resposta'>P(NÃO exigir reparo) = 1 - " + formatar(p) + " = " + (total - ocorrencias) + " / " + total
        + " = " + formatar(1 - p) + " (" + porcentagem(1 - p) + ")</p>";

    mostrar("r6", html);
}

// 7. Bayes (rede)
function questao7() {
    let nomes = lerNomes("p7_nomes");
    let pedidos = lerLista("p7_pedidos");
    let erros = lerLista("p7_erros");
    let alvo = document.getElementById("p7_alvo").value.trim();

    if (nomes.length != pedidos.length || nomes.length != erros.length) {
        mostrarErro("r7", "As três listas precisam ter o mesmo tamanho.");
        return;
    }
    if (!nomes.includes(alvo)) {
        mostrarErro("r7", "O cliente " + alvo + " não está na lista.");
        return;
    }

    let priori = [];
    let taxa = [];
    for (let i = 0; i < nomes.length; i++) {
        priori.push(pedidos[i] / 100);
        taxa.push(erros[i] / 100);
    }

    let resultado = bayes(priori, taxa);

    let html = "<table><tr><th>Cliente</th><th>P(cliente)</th><th>P(erro | cliente)</th><th>P(cliente) x P(erro | cliente)</th></tr>";
    for (let i = 0; i < nomes.length; i++) {
        html += "<tr><td>" + nomes[i] + "</td><td>" + formatar(priori[i], 3) + "</td><td>" + formatar(taxa[i], 3)
            + "</td><td>" + formatar(priori[i] * taxa[i], 5) + "</td></tr>";
    }
    html += "</table>";

    let i = nomes.indexOf(alvo);
    html += "<p class='resposta'>a) P(erro) = soma da última coluna = " + formatar(resultado.total, 5)
        + " (" + porcentagem(resultado.total) + ")</p>";
    html += "<p class='resposta'>b) P(" + alvo + " | erro) = " + formatar(priori[i] * taxa[i], 5) + " / "
        + formatar(resultado.total, 5) + " = " + formatar(resultado.posteriori[i]) + " (" + porcentagem(resultado.posteriori[i]) + ")</p>";

    mostrar("r7", html);
}

// 8. Bayes (máquinas)
function questao8() {
    let nomes = lerNomes("p8_nomes");
    let producao = lerLista("p8_producao");
    let defeitos = lerLista("p8_defeitos");

    if (nomes.length != producao.length || nomes.length != defeitos.length) {
        mostrarErro("r8", "As três listas precisam ter o mesmo tamanho.");
        return;
    }

    let priori = [];
    let taxa = [];
    for (let i = 0; i < nomes.length; i++) {
        priori.push(producao[i] / 100);
        taxa.push(defeitos[i] / 100);
    }

    let resultado = bayes(priori, taxa);

    let html = "<p>P(defeituoso) = " + formatar(resultado.total) + " (" + porcentagem(resultado.total) + ")</p>";
    html += "<table><tr><th>Máquina</th><th>P(máquina | defeituoso)</th></tr>";
    for (let i = 0; i < nomes.length; i++) {
        html += "<tr><td>" + nomes[i] + "</td><td>" + formatar(priori[i], 2) + " x " + formatar(taxa[i], 2) + " / "
            + formatar(resultado.total) + " = <b>" + formatar(resultado.posteriori[i]) + "</b> ("
            + porcentagem(resultado.posteriori[i]) + ")</td></tr>";
    }
    html += "</table>";

    mostrar("r8", html);
    desenharGrafico("g8", "bar", nomes, resultado.posteriori, "P(máquina | defeituoso)");
}

// 9. Série e paralelo

// série: todos funcionam
function serie(a, b) {
    return a * b;
}

// paralelo: basta um funcionar
function paralelo(a, b) {
    return 1 - (1 - a) * (1 - b);
}

function questao9() {
    let configuracao = document.getElementById("p9_config").value;
    let tipo = document.getElementById("p9_tipo").value;
    let c = [lerNumero("p9_c1"), lerNumero("p9_c2"), lerNumero("p9_c3"), lerNumero("p9_c4")];

    if (tipo == "falha") {
        for (let i = 0; i < 4; i++) {
            c[i] = 1 - c[i];
        }
    }

    let html = "<p>Probabilidade de funcionamento: C1 = " + formatar(c[0], 2) + ", C2 = " + formatar(c[1], 2)
        + ", C3 = " + formatar(c[2], 2) + ", C4 = " + formatar(c[3], 2) + "</p>";
    let sistema;

    if (configuracao == "1") {
        let ramoCima = serie(c[0], c[1]);
        let ramoBaixo = serie(c[2], c[3]);
        sistema = paralelo(ramoCima, ramoBaixo);
        html += "<p>Ramo de cima (C1 e C2 em série) = " + formatar(c[0], 2) + " x " + formatar(c[1], 2) + " = " + formatar(ramoCima) + "</p>";
        html += "<p>Ramo de baixo (C3 e C4 em série) = " + formatar(c[2], 2) + " x " + formatar(c[3], 2) + " = " + formatar(ramoBaixo) + "</p>";
        html += "<p>Os dois ramos em paralelo = 1 - (1 - " + formatar(ramoCima) + ") x (1 - " + formatar(ramoBaixo) + ")</p>";
    } else {
        let blocoEsquerda = paralelo(c[0], c[2]);
        let blocoDireita = paralelo(c[1], c[3]);
        sistema = serie(blocoEsquerda, blocoDireita);
        html += "<p>Bloco da esquerda (C1 e C3 em paralelo) = 1 - (1 - " + formatar(c[0], 2) + ") x (1 - " + formatar(c[2], 2) + ") = " + formatar(blocoEsquerda) + "</p>";
        html += "<p>Bloco da direita (C2 e C4 em paralelo) = 1 - (1 - " + formatar(c[1], 2) + ") x (1 - " + formatar(c[3], 2) + ") = " + formatar(blocoDireita) + "</p>";
        html += "<p>Os dois blocos em série = " + formatar(blocoEsquerda) + " x " + formatar(blocoDireita) + "</p>";
    }

    html += "<p class='resposta'>P(sistema funcionar) = " + formatar(sistema, 6) + " (" + porcentagem(sistema) + ")</p>";
    mostrar("r9", html);
}

// 10. Soma de variáveis
function questao10() {
    let medias = lerLista("p10_medias");
    let desvios = lerLista("p10_desvios");

    if (medias.length != desvios.length) {
        mostrarErro("r10", "Precisa ter um desvio-padrão para cada média.");
        return;
    }

    // média: soma das médias | variância: soma das variâncias (independentes)
    let mediaTotal = 0;
    let varianciaTotal = 0;
    for (let i = 0; i < medias.length; i++) {
        mediaTotal = mediaTotal + medias[i];
        varianciaTotal = varianciaTotal + desvios[i] * desvios[i];
    }
    let desvioTotal = Math.sqrt(varianciaTotal);

    let html = "<p>Média do peso bruto = " + medias.join(" + ") + " = " + mediaTotal + " g</p>";
    html += "<p>Variância do peso bruto = " + desvios.join("² + ") + "² = " + varianciaTotal + " g²</p>";
    html += "<p class='resposta'>Média = " + mediaTotal + " g e Desvio-padrão = √" + varianciaTotal + " = "
        + formatar(desvioTotal) + " g</p>";
    html += "<p class='dica'>Obs.: não se somam os desvios-padrão direto, soma-se as variâncias.</p>";

    mostrar("r10", html);
}

// 11. Binomial
function questao11() {
    let p = lerNumero("p11_p");
    let n = lerNumero("p11_n");
    let exato = lerNumero("p11_exato");
    let maisDe = lerNumero("p11_maisde");

    // a) P(X >= 1) = 1 - P(X = 0)
    let pAlgum = 1 - binomial(0, n, p);

    let pExato = binomial(exato, n, p);

    // c) pelo complemento: 1 - P(X <= maisDe)
    let acumulado = 0;
    for (let k = 0; k <= maisDe; k++) {
        acumulado = acumulado + binomial(k, n, p);
    }
    let pMaisDe = 1 - acumulado;

    let esperadoDefeituosos = n * p;
    let esperadoBons = n - esperadoDefeituosos;
    let variancia = n * p * (1 - p);

    let html = "<p class='resposta'>a) P(algum com defeito) = 1 - P(X = 0) = " + formatar(pAlgum) + " (" + porcentagem(pAlgum) + ")</p>";
    html += "<p class='resposta'>b) P(X = " + exato + ") = C(" + n + "," + exato + ") . " + formatarLimite(p) + "^" + exato + " . " + formatar(1 - p, 2) + "^" + (n - exato)
        + " = " + formatar(pExato) + " (" + porcentagem(pExato) + ")</p>";
    html += "<p class='resposta'>c) P(X > " + maisDe + ") = 1 - P(X ≤ " + maisDe + ") = " + formatar(pMaisDe) + " (" + porcentagem(pMaisDe) + ")</p>";
    html += "<p class='resposta'>d) Esperado com defeito = n . p = " + formatar(esperadoDefeituosos, 2) + " | itens bons = " + formatar(esperadoBons, 2) + "</p>";
    html += "<p class='resposta'>e) Variância = n . p . (1 - p) = " + formatar(variancia) + "</p>";

    mostrar("r11", html);

    let rotulos = [];
    let valores = [];
    let limite = Math.min(n, 30);
    for (let k = 0; k <= limite; k++) {
        rotulos.push(k);
        valores.push(binomial(k, n, p));
    }
    desenharGrafico("g11", "bar", rotulos, valores, "P(X = k) - número de itens com defeito");
}

// 12. Hipergeométrica
function questao12() {
    let mulheres = lerNumero("p12_mulheres");
    let homens = lerNumero("p12_homens");
    let n = lerNumero("p12_n");
    let x = lerNumero("p12_x");
    let N = mulheres + homens;

    if (n > N || x > n) {
        mostrarErro("r12", "Valores inválidos: n tem que ser ≤ população e x ≤ n.");
        return;
    }

    let p = hipergeometrica(x, N, mulheres, n);

    let html = "<p>N = " + N + ", K = " + mulheres + " mulheres, n = " + n + " sorteados, x = " + x + "</p>";
    html += "<p>P(X = " + x + ") = C(" + mulheres + "," + x + ") . C(" + homens + "," + (n - x) + ") / C(" + N + "," + n + ") = "
        + combinacao(mulheres, x) + " . " + combinacao(homens, n - x) + " / " + combinacao(N, n) + "</p>";
    html += "<p class='resposta'>P(exatamente " + x + " mulher(es)) = " + formatar(p) + " (" + porcentagem(p) + ")</p>";

    mostrar("r12", html);
}

// 13. Poisson

function segundos(unidade) {
    if (unidade == "seg") {
        return 1;
    }
    if (unidade == "min") {
        return 60;
    }
    return 3600;
}

function questao13() {
    let taxa = lerNumero("p13_taxa");
    let unidadeTaxa = document.getElementById("p13_unidade").value;
    let html = "";
    let letras = ["a", "b"];

    for (let i = 0; i < 2; i++) {
        let k = lerNumero("p13_k" + (i + 1));
        let tempo = lerNumero("p13_t" + (i + 1));
        let unidade = document.getElementById("p13_u" + (i + 1)).value;

        // converte o tempo para a unidade da taxa
        let tempoConvertido = tempo * segundos(unidade) / segundos(unidadeTaxa);
        let lambda = taxa * tempoConvertido;
        let p = poisson(k, lambda);

        html += "<p>" + letras[i] + ") Em " + tempo + " " + unidade + ": λ = " + taxa + " x " + formatar(tempoConvertido, 2)
            + " = " + formatar(lambda, 2) + "</p>";
        html += "<p class='resposta'>P(X = " + k + ") = e^(-" + formatar(lambda, 2) + ") . " + formatar(lambda, 2) + "^" + k + " / " + k
            + "! = " + formatar(p) + " (" + porcentagem(p) + ")</p>";
    }

    mostrar("r13", html);
}

// 14. Binomial x Poisson
function questao14() {
    let p = lerNumero("p14_p");
    let n = lerNumero("p14_n");
    let maisDe = lerNumero("p14_maisde");
    let lambda = n * p;

    let somaBinomial = 0;
    let somaPoisson = 0;
    for (let k = 0; k <= maisDe; k++) {
        somaBinomial = somaBinomial + binomial(k, n, p);
        somaPoisson = somaPoisson + poisson(k, lambda);
    }

    let html = "<p>Média de bits com erro: λ = n . p = " + n + " x " + formatarLimite(p) + " = " + formatar(lambda, 2) + "</p>";
    html += "<p class='resposta'>P(X > " + maisDe + ") pela binomial = " + formatar(1 - somaBinomial, 5) + " (" + porcentagem(1 - somaBinomial) + ")</p>";
    html += "<p>P(X > " + maisDe + ") pela aproximação de Poisson = " + formatar(1 - somaPoisson, 5) + "</p>";
    html += "<p class='dica'>Como n é grande e p é pequeno, as duas dão quase o mesmo valor.</p>";

    mostrar("r14", html);
}

// 15. Uniforme
function questao15() {
    let A = lerNumero("p15_a");
    let B = lerNumero("p15_b");
    let C = lerNumero("p15_c");
    let D = lerNumero("p15_d");

    if (B <= A || D < C) {
        mostrarErro("r15", "B precisa ser maior que A e D maior ou igual a C.");
        return;
    }

    let esperanca = (A + B) / 2;
    let variancia = (B - A) * (B - A) / 12;

    // só a parte de [C, D] dentro de [A, B]
    let inicio = Math.max(A, C);
    let fim = Math.min(B, D);
    let p = 0;
    if (fim > inicio) {
        p = (fim - inicio) / (B - A);
    }

    let html = "<p class='resposta'>E(X) = (A + B) / 2 = (" + A + " + " + B + ") / 2 = " + formatar(esperanca) + "</p>";
    html += "<p class='resposta'>Var(X) = (B - A)² / 12 = (" + B + " - " + A + ")² / 12 = " + formatar(variancia) + "</p>";
    html += "<p class='resposta'>P(" + C + " < X < " + D + ") = (" + fim + " - " + inicio + ") / (" + B + " - " + A + ") = "
        + formatar(p) + " (" + porcentagem(p) + ")</p>";

    mostrar("r15", html);
}

// 16. Exponencial
function questao16() {
    let lambda = lerNumero("p16_lambda");
    let C = lerNumero("p16_c");
    let D = lerNumero("p16_d");

    // P(T > t) = e^(-lambda . t)
    let pC = Math.exp(-lambda * C);
    let pD = Math.exp(-lambda * D);

    let html = "<p>Tempo médio até falhar = 1 / λ = " + formatar(1 / lambda, 2) + " horas</p>";
    html += "<p class='resposta'>P(sobreviver a " + C + " h) = e^(-" + formatarLimite(lambda) + " x " + C + ") = " + formatar(pC) + " (" + porcentagem(pC) + ")</p>";
    html += "<p class='resposta'>P(sobreviver a " + D + " h) = e^(-" + formatarLimite(lambda) + " x " + D + ") = " + formatar(pD) + " (" + porcentagem(pD) + ")</p>";

    mostrar("r16", html);

    let rotulos = [];
    let valores = [];
    let passo = Math.max(C, D) * 2 / 20;
    for (let i = 0; i <= 20; i++) {
        let t = Math.round(i * passo);
        rotulos.push(t + " h");
        valores.push(Math.exp(-lambda * t));
    }
    desenharGrafico("g16", "line", rotulos, valores, "P(T > t) - probabilidade de sobreviver");
}

// 17. Soma de normais
function questao17() {
    let M1 = lerNumero("p17_m1");
    let D1 = lerNumero("p17_d1");
    let M2 = lerNumero("p17_m2");
    let D2 = lerNumero("p17_d2");
    let MS = lerNumero("p17_ms");
    let I1 = lerNumero("p17_i1");
    let I2 = lerNumero("p17_i2");

    // W = X1 + X2 também é normal
    let media = M1 + M2;
    let desvio = Math.sqrt(D1 * D1 + D2 * D2);

    let pA = 1 - normalAcumulada(MS, media, desvio);
    let pB = normalEntre(I1, I2, media, desvio);

    let html = "<p>Peso bruto W: média = " + M1 + " + " + M2 + " = " + media + " g, desvio = √(" + D1 + "² + " + D2 + "²) = " + formatar(desvio) + " g</p>";
    html += "<p class='resposta'>a) P(W > " + MS + ") = P(Z > " + formatar((MS - media) / desvio, 2) + ") = " + formatar(pA) + " (" + porcentagem(pA) + ")</p>";
    html += "<p class='resposta'>b) P(" + I1 + " < W < " + I2 + ") = P(" + formatar((I1 - media) / desvio, 2) + " < Z < "
        + formatar((I2 - media) / desvio, 2) + ") = " + formatar(pB) + " (" + porcentagem(pB) + ")</p>";

    mostrar("r17", html);
}

// 18. Normal padrão
function questao18() {
    let html = "";
    let letras = ["a", "b", "c"];

    for (let i = 0; i < 3; i++) {
        let a = lerNumero("p18_a" + (i + 1));
        let b = lerNumero("p18_b" + (i + 1));
        let p = normalEntre(a, b, 0, 1);

        html += "<p class='resposta'>" + letras[i] + ") P(" + formatarLimite(a) + " < Z < " + formatarLimite(b) + ") = "
            + formatar(p) + " (" + porcentagem(p) + ")</p>";
    }

    mostrar("r18", html);
}

// 19. Normal
function questao19() {
    let media = lerNumero("p19_media");
    let desvio = lerNumero("p19_desvio");
    let entreA = lerNumero("p19_entre1");
    let entreB = lerNumero("p19_entre2");
    let maior = lerNumero("p19_maior");
    let menor = lerNumero("p19_menor");

    let pEntre = normalEntre(entreA, entreB, media, desvio);
    let pMaior = 1 - normalAcumulada(maior, media, desvio);
    let pMenor = normalAcumulada(menor, media, desvio);

    let html = "<p class='resposta'>a) P(" + entreA + " < X < " + entreB + ") = P(" + formatar((entreA - media) / desvio, 2) + " < Z < "
        + formatar((entreB - media) / desvio, 2) + ") = " + formatar(pEntre) + " (" + porcentagem(pEntre) + ")</p>";
    html += "<p class='resposta'>b) P(X > " + maior + ") = P(Z > " + formatar((maior - media) / desvio, 2) + ") = "
        + formatar(pMaior) + " (" + porcentagem(pMaior) + ")</p>";
    html += "<p class='resposta'>c) P(X < " + menor + ") = P(Z < " + formatar((menor - media) / desvio, 2) + ") = "
        + formatar(pMenor) + " (" + porcentagem(pMenor) + ")</p>";

    mostrar("r19", html);

    let rotulos = [];
    let valores = [];
    for (let i = 0; i <= 40; i++) {
        let x = media - 4 * desvio + i * (8 * desvio / 40);
        let z = (x - media) / desvio;
        rotulos.push(formatar(x, 1));
        valores.push(Math.exp(-z * z / 2) / (desvio * Math.sqrt(2 * Math.PI)));
    }
    desenharGrafico("g19", "line", rotulos, valores, "Curva da normal (média " + media + ", desvio " + desvio + ")");
}

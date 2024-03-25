document.addEventListener('DOMContentLoaded', () => {
    // Atualiza a data automaticamente quando a página é carregada
    atualizarData();
    // Carrega o ID do Discord se estiver salvo
    carregarIDDiscord();
    // Configura o ouvinte de eventos para cada mudança nos campos de entrada
    const campos = document.querySelectorAll('#relatorioForm input, #relatorioForm select');
    campos.forEach(campo => campo.addEventListener('input', gerarECopiarRelatorio));
    // Configura o texto inicial baseado no status de revisão
    atualizarDecisao();
});

function atualizarData() {
    const dataAtual = new Date();
    const dia = ('0' + dataAtual.getDate()).slice(-2); // Adiciona zero se necessário
    const mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2); // Adiciona zero se necessário
    document.getElementById('data').value = `${dia}/${mes}`;
}

function atualizarDecisao() {
    const revisaoStatus = document.getElementById("revisaoStatus").value;
    const labelPunicao = document.getElementById("labelPunicao");
    // Altera o texto de "Punição" para "Remoção" ou "Convertida" conforme a seleção
    if (revisaoStatus === "aceita") {
        labelPunicao.textContent = "Remoção:";
    } else if (revisaoStatus === "convertida") {
        labelPunicao.textContent = "Convertida:";
    } else {
        labelPunicao.textContent = "Punição:";
    }
}

function gerarECopiarRelatorio() {
    gerarRelatorio();
    copiarRelatorio();
}

function gerarRelatorio() {
    const status = document.getElementById("revisaoStatus").value;
    const id = document.getElementById("id").value;
    const data = document.getElementById('data').value;
    const ticket = document.getElementById("ticket").value;
    const motivo = document.getElementById("motivo").value;
    const punicaoSelect = document.getElementById("punicao");
    const punicaoValue = punicaoSelect.value;
    const discordID = document.getElementById("discordID").value;
    
    let emoji = "❌";
    let statusTexto = "REVISÃO NEGADA";
    let decisaoTexto = "NEGADO POR";
    let rotuloPunicao = "PUNIÇÃO";

    if (status === "aceita") {
        emoji = "✅";
        statusTexto = "REVISÃO ACEITA";
        decisaoTexto = "REVOGADOR POR";
        rotuloPunicao = "REMOÇÃO";
    } else if (status === "convertida") {
        emoji = "✅";

        statusTexto = "REVISÃO CONVERTIDA";
        
        decisaoTexto = "REVOGADO POR"; // Altere conforme o termo correto para esta condição
        rotuloPunicao = "CONVERTIDO EM "; // Aqui alteramos para o termo desejado
    }


    const relatorioTexto = `\`\`\`${emoji} ${statusTexto} ${emoji} \`\`\`\n` + 
                           `>>> **| ID: ${id}\n` +
                           `| DATA: ${data}\n` +
                           `| TICKET: ${ticket}\n` +
                           `| MOTIVO: ${motivo}\n` +
                           `| ${rotuloPunicao}: ${punicaoValue}\n` + 
                           
                           `| ${decisaoTexto}: ** <@${discordID}>\n` ; 

    document.getElementById("resultadoRelatorio").innerText = relatorioTexto;
}


function copiarRelatorio() {
    const relatorioTexto = document.getElementById("resultadoRelatorio").innerText;
    navigator.clipboard.writeText(relatorioTexto).then(() => {
        console.log('Relatório copiado para a área de transferência!');
    }, (err) => {
        console.error('Erro ao copiar relatório: ', err);
    });
}

function salvarIDDiscord() {
    const discordID = document.getElementById('discordID').value;
    localStorage.setItem('discordID', discordID);
}

function carregarIDDiscord() {
    const discordID = localStorage.getItem('discordID');
    if (discordID) {
        document.getElementById('discordID').value = discordID;
    }
    atualizarDecisao();
}

document.addEventListener("DOMContentLoaded", () => {
    listarUsuarios();
});

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

document.getElementById("userForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let cpf = document.getElementById("cpf").value.trim();
    let nome = document.getElementById("nome").value.trim();
    let dataNascimento = document.getElementById("dataNascimento").value;
    let email = document.getElementById("email").value.trim();

    if (!cpf || !nome || !dataNascimento || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    let usuarioExistente = usuarios.find(u => u.cpf === cpf);
    if (usuarioExistente) {
        alert("CPF já cadastrado!");
        return;
    }

    let usuario = { cpf, nome, dataNascimento, email };
    usuarios.push(usuario);
    salvarUsuarios();
    listarUsuarios();
    document.getElementById("userForm").reset();
});

function listarUsuarios(lista = usuarios) {
    let tabela = document.getElementById("userTable");
    tabela.innerHTML = "";

    lista.forEach((usuario, index) => {
        let row = tabela.insertRow();
        row.insertCell(0).textContent = usuario.cpf;
        row.insertCell(1).textContent = usuario.nome;
        row.insertCell(2).textContent = usuario.dataNascimento;
        row.insertCell(3).textContent = usuario.email;

        let actionsCell = row.insertCell(4);
        actionsCell.innerHTML = `
            <button onclick="editarUsuario('${usuario.cpf}')">Editar</button>
            <button class="delete-btn" onclick="excluirUsuario(${index})">Excluir</button>
        `;
    });
}

function excluirUsuario(index) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        usuarios.splice(index, 1);
        salvarUsuarios();
        listarUsuarios();
    }
}

function pesquisarUsuario() {
    let nomeBusca = document.getElementById("searchNome").value.trim().toLowerCase();
    let resultado = usuarios.filter(user => user.nome.toLowerCase().includes(nomeBusca));
    listarUsuarios(resultado);
}

function editarUsuario(cpf) {
    let usuario = usuarios.find(user => user.cpf === cpf);
    if (!usuario) return;

    document.getElementById("cpf").value = usuario.cpf;
    document.getElementById("cpf").setAttribute("disabled", "true");
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("dataNascimento").value = usuario.dataNascimento;
    document.getElementById("email").value = usuario.email;

    let btn = document.querySelector("#userForm button");
    btn.textContent = "Atualizar Usuário";
    btn.onclick = function () {
        atualizarUsuario(cpf);
    };
}

function atualizarUsuario(cpf) {
    let index = usuarios.findIndex(user => user.cpf === cpf);
    if (index === -1) return;

    usuarios[index].nome = document.getElementById("nome").value.trim();
    usuarios[index].dataNascimento = document.getElementById("dataNascimento").value;
    usuarios[index].email = document.getElementById("email").value.trim();

    salvarUsuarios();
    listarUsuarios();
    document.getElementById("userForm").reset();
    document.getElementById("cpf").removeAttribute("disabled");

    let btn = document.querySelector("#userForm button");
    btn.textContent = "Adicionar Usuário";
    btn.onclick = function (event) {
        event.preventDefault();
        document.getElementById("userForm").dispatchEvent(new Event("submit"));
    };
}

function salvarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

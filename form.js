document.addEventListener("DOMContentLoaded", function () {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyPVF_8a769mO2H-Qdyee_L0fYiezlxcq-8-k9c_bKgv5rM08oxW1V4N_GU00HkB0di/exec';
    const form = document.forms["contact-form"];
    const phoneInput = document.getElementById("phone");
    const submitButton = document.getElementById("btnSubmit");

    // Máscara para o campo de telefone
    phoneInput.addEventListener("input", function () {
        let value = phoneInput.value.replace(/\D/g, "");
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        }
        phoneInput.value = value;
    });

    // Função para fechar o popup
    document.getElementById("close-popup").addEventListener("click", function() {
        document.querySelector(".overlay").style.display = "none";
    });

    // Fecha o popup ao clicar fora do conteúdo do formulário
    document.querySelector(".popup-overlay").addEventListener("click", function() {
        document.querySelector(".overlay").style.display = "none";
    });

    // Adiciona ou remove a classe "filled" e valida o input em tempo real
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.toggle('filled', input.value.trim() !== '');
            validateInput(input);
        });
    });

    // Função de validação para exibir mensagens de erro
    function validateInput(input) {
        const errorId = input.id + "-error";
        const output = document.getElementById(errorId);

        if (!input.checkValidity()) {
            input.classList.add('invalid');
            output.style.display = "block";
            output.textContent = input.validationMessage;
        } else {
            input.classList.remove('invalid');
            output.style.display = "none";
            output.textContent = "";
        }
    }

    // Evento único de submit que valida e envia o formulário
    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        let isFormValid = true;

        // Verifica cada campo
        form.querySelectorAll('input').forEach(input => {
            validateInput(input);
            if (!input.checkValidity()) {
                isFormValid = false;
            }
        });

        // Se o formulário for válido, envia ao Google Sheets e exibe o alerta
        if (isFormValid) {
            setLoadingState(true);
            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then(response => {
                    if (!response.ok) throw new Error("Erro ao enviar dados.");
                    return response.json();
                })
                .then(() => {
                    alert("Seu formulário foi enviado com sucesso!");
                    form.reset(); // Limpa o formulário após o envio
                    setLoadingState(false);
                    window.location.reload(); // Recarrega a página
                })
                .catch(error => alert('Error!', error.message));
                alert("Erro ao enviar o formulário: " + error.message);
                setLoadingState(false);
        }
    });
    function setLoadingState(isLoading) {
        document.querySelectorAll('input').forEach(input => {
            input.classList.add('disabled');
        });
        submitButton.classList.toggle('loading', isLoading); // Apenas exibe ou oculta o spinner
    }
});


// document.addEventListener('DOMContentLoaded', function () {
//     // Seleciona todos os botões com a classe "btn" e aplica o evento de clique
//     const buttons = document.querySelectorAll('.btn');

//     buttons.forEach(button => {
//         button.addEventListener('click', function (e) {
//             e.preventDefault(); // Evita o redirecionamento imediato
//             document.getElementById("popup-form").style.display = "block";
//         });
//     });

//     // Função para fechar o popup
//     
// });


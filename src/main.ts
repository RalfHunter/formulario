import { ZodError } from 'zod';
import './style.css';
import formulario from './validation';



const app = document.querySelector('#app')!;
const form = document.querySelector('form')!;
const termo = form.querySelector<HTMLInputElement>('#checkbox')!;
const mode = form.querySelector<HTMLInputElement>('.modo')!
const celest = mode.querySelector<HTMLImageElement>('img')!
const urlLocal = window.location.href
const dados = form.querySelectorAll<HTMLDivElement>('.dados')!
const info = form.querySelector<HTMLDivElement>('.info')!

// let campos = []
mode.addEventListener('click', () => {
    mode.classList.toggle('dark')
    form.classList.toggle('dark')
    app.classList.toggle('dark')
    info.classList.toggle('dark')
    dados.forEach(dado => {
        dado.classList.toggle('dark')
    })
    celest.src = celest.src === urlLocal+"public/moon-star%201.svg" ? urlLocal+"public/sun-moon%201.svg": urlLocal+"public/moon-star%201.svg" 

})
termo.addEventListener('invalid', function () {
    this.setCustomValidity("Você precisa aceitar os termos antes de enviar o formulário.");
});

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const sexo = document.querySelector<HTMLInputElement>('input[name="sexo"]:checked');
    const dadosForm = new FormData(form);

    try {
        const saveForm = {
            name: dadosForm.get('name'),
            email: dadosForm.get('email'),
            sexo: sexo?.value,
            curso: dadosForm.get('curso'),
            obs: dadosForm.get('obs'),
            termos: dadosForm.get('termos')
        };

        formulario.parse(saveForm);
        fetch(`http://localhost:3000/usuarios`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...saveForm
                })
            }).then(response => {
                if (!response.ok) throw new Error('Erro na requisição')
                return response.json()
            })
            .then(data => {
                console.log('Resposta do servidor:', data)
            })
            .catch(error => {
                console.error('Erro:', error)
                window.alert("Falha na Conexão, não foi possivel se conectar ao banco de dados.")
            })
            window.alert("Sucesso ao cadastrar!")
            limparCampos()
    } catch (err) {
        if (err instanceof ZodError) {
            let focado = false;

            err.errors.forEach((erro) => {
                const nome = erro.path[0];

                if (nome === "curso") {
                    const campo = document.querySelector<HTMLSelectElement>(`select[name=${nome}]`)!;
                    aplicarErroCampo(campo, erro.message, 'change');
                    focado ||= !!campo;
                } else if (nome === "obs") {
                    const campo = document.querySelector<HTMLTextAreaElement>(`textarea[name=${nome}]`)!;
                    aplicarErroCampo(campo, erro.message, 'input');
                    focado ||= !!campo;
                } else if (nome === "sexo") {
                    const campos = document.querySelectorAll<HTMLInputElement>(`input[name=${nome}]`)!;
                    campos.forEach((campo) => {
                        campo.setCustomValidity(erro.message);
                        campo.reportValidity();
                        const limpar = () => {
                            campos.forEach((r) => {
                                r.setCustomValidity("");
                                r.removeEventListener("input", limpar);
                            });
                        };
                        campo.addEventListener("input", limpar);
                    });
                    if (!focado && campos.length > 0) {
                        campos[0].focus();
                        focado = true;
                    }
                } else {
                    const campo = document.querySelector<HTMLInputElement>(`input[name=${nome}]`)!;
                    aplicarErroCampo(campo, erro.message, 'input');
                    focado ||= !!campo;
                }
            });
        }
    }
});

// Função utilitária para aplicar erro a campos
function aplicarErroCampo(
    campo: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    mensagem: string,
    evento: 'input' | 'change'
) {
    if (!campo) return;
    campo.setCustomValidity(mensagem);
    campo.reportValidity();
    campo.focus();

    const limpar = () => {
        campo.setCustomValidity("");
        campo.removeEventListener(evento, limpar);
    };

    campo.addEventListener(evento, limpar);
}
function limparCampos(){
    const inputs = form.querySelectorAll<HTMLInputElement>('input')
    inputs.forEach(input => {
        if(input.type == 'text' || input.type =='email'){
            input.value = ''
        }else{
            input.checked = false
        }
    })
    const obs = form.querySelector<HTMLTextAreaElement>('textarea')!
    obs.value = ''
    const select = form.querySelector<HTMLSelectElement>('select')!
    select.selectedIndex = 0
}
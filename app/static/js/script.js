document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeBtn = document.querySelector('.theme-toggle');

    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeBtn) themeBtn.textContent = '☀️';
    } else {
        document.body.removeAttribute('data-theme');
        if (themeBtn) themeBtn.textContent = '🌙';
    }
});

function toggleTheme() {
    const body = document.body;
    const themeBtn = document.querySelector('.theme-toggle');

    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (themeBtn) themeBtn.textContent = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeBtn) themeBtn.textContent = '☀️';
    }
}

function addEquation() {
    const equationsList = document.getElementById('equations-list');
    
    const currentEquations = equationsList.querySelectorAll('.equation-row').length;
    
    if (currentEquations >= 5) {
        alert("O sistema permite adicionar no máximo 5 equações.");
        return;
    }

    const newRow = document.createElement('div');
    newRow.className = 'equation-row';
    
    newRow.innerHTML = `
        <input type="text" class="eq-input" placeholder="Ex: 2x + 1">
        ≡ <input type="text" class="num-input" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')"> 
        (mod <input type="text" class="num-input" inputmode="numeric" oninput="this.value = this.value.replace(/[^0-9]/g, '')">)
        <button class="btn-remove" onclick="removeEquation(this)">✖</button>
    `;
    
    equationsList.appendChild(newRow);
}

function removeEquation(btnElement) {
    const list = document.getElementById('equations-list');
    const rows = list.querySelectorAll('.equation-row');
    if (rows.length > 2) {
        btnElement.parentElement.remove();
    } else {
        alert("O sistema precisa ter no mínimo duas equações.");
    }
}

function parseEquationString(eqStr) {
    const cleanStr = eqStr.replace(/\s+/g, '');
    
    const xMatch = cleanStr.match(/(^|[+-])(\d*)x/);
    
    if (!xMatch) {
        return null; 
    }
    
    const sign = xMatch[1] === '-' ? -1 : 1;
    const coef = xMatch[2] === '' ? 1 : parseInt(xMatch[2], 10);
    const a = sign * coef;
    
    const noXStr = cleanStr.replace(/(^|[+-])\d*x/, '');
    
    let b = 0;
    if (noXStr !== '') {
        b = parseInt(noXStr, 10);
        if (isNaN(b)) return null;
    }
    
    return { a: a, b: b };
}

function collectEquationsData() {
    const rows = document.querySelectorAll('.equation-row'); 
    const equacoesParaBackend = [];
    
    for (let row of rows) {
        const eqInput = row.querySelector('.eq-input').value; 
        const numInputs = row.querySelectorAll('.num-input'); 
        const cInput = numInputs[0].value; 
        const nInput = numInputs[1].value; 
        
        if (!eqInput || !cInput || !nInput) {
            alert("Por favor, preencha todos os campos antes de gerar o passo a passo.");
            return null; 
        }
        
        const parsedEq = parseEquationString(eqInput);
        if (!parsedEq) {
            alert(`A equação "${eqInput}" está num formato inválido. Use formatos como "2x + 1" ou "x - 3".`);
            return null;
        }
        
        equacoesParaBackend.push({
            "a": parsedEq.a,             // termo dependente de x
            "b": parsedEq.b,             // termo independente com sinal (0 se não houver)
            "c": parseInt(cInput, 10),   // resultado da congruência
            "n": parseInt(nInput, 10)    // módulo
        });
    }
    
    return { "equacoes": equacoesParaBackend };
}

function generateSteps() {
    const dados = collectEquationsData();
    
    if (!dados) return; 

    console.log("JSON pronto para enviar ao Backend em Python:", JSON.stringify(dados, null, 2));

    const solution = document.getElementById('solution-container');
    if (solution) {
        solution.style.display = 'block';
    }
    
    // NOTA FUTURA: Quando o código Python do tcr_solver.py estiver pronto, 
    // é aqui dentro que irá apagar o console.log e colocar o comando fetch('/resolver', ...)
}
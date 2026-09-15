document.addEventListener('DOMContentLoaded', () => {
    // Elementos do terminal principal e busca
    const input = document.getElementById('terminal-input');
    const mainElement = document.querySelector('main');
    const trigger = document.getElementById('command-line-trigger');
    const container = document.querySelector('.container');

    // Elementos da interface do recrutador
    const recruiterContainer = document.getElementById('recruiter-ui-container');
    const loaderLog = document.getElementById('loader-log');
    const recruiterDashboard = document.getElementById('recruiter-dashboard');
    const optionCommandLine = document.getElementById('option-command-line');
    const optionInput = document.getElementById('option-input');
    const optionErrorMessage = document.getElementById('option-error-message');
    const optionTrigger = document.getElementById('option-command-line');

    if (!input || !mainElement) return;

    // Salva o HTML original do <main> para restaurar a cada busca
    const originalMainHTML = mainElement.innerHTML;

    let isVisualMode = false;
    let isTransitioning = false;

    // Inicializa a largura do input principal
    updateInputWidth(input);

    // Garante que o input principal ganhe foco ao carregar
    input.focus();

    // Eventos de clique para focar os inputs correspondentes
    if (trigger) {
        trigger.addEventListener('click', () => {
            if (!isVisualMode && !isTransitioning) {
                input.focus();
            }
        });
    }

    if (optionTrigger) {
        optionTrigger.addEventListener('click', () => {
            if (isVisualMode && !isTransitioning) {
                optionInput.focus();
            }
        });
    }

    // Gerencia a digitação e busca dinâmica no input principal
    input.addEventListener('input', () => {
        if (isVisualMode || isTransitioning) return;

        updateInputWidth(input);
        const query = input.value.trim().toLowerCase();
        
        // Se a query for vazia ou for o comando padrão, exibe o currículo original completo
        if (query === '' || input.value === './visualizar_cv.sh') {
            mainElement.innerHTML = originalMainHTML;
            return;
        }

        // Restaura o HTML original antes de aplicar novos destaques
        mainElement.innerHTML = originalMainHTML;

        // Aplica o realce (<mark>) nos textos correspondentes
        highlightText(mainElement, query);

        // Filtra os elementos ocultando o que não corresponde
        filterElements(mainElement);
    });

    // Detecta o Enter para ativar o Modo Visual
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = input.value.trim();
            if (cmd === './visualizar_cv.sh --modo-visual') {
                startVisualMode();
            }
        }
    });

    // Gerencia a entrada de opções no prompt inferior do recrutador
    if (optionInput) {
        optionInput.addEventListener('input', () => {
            updateInputWidth(optionInput);
        });

        optionInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const option = optionInput.value.trim();
                executeOption(option);
            }
        });
    }

    /**
     * Ativa o Modo Visual com simulação de carregamento do terminal
     */
    function startVisualMode() {
        if (isTransitioning || isVisualMode) return;
        isTransitioning = true;

        // Oculta o currículo tradicional
        if (container) {
            container.classList.add('search-hidden');
        }

        // Exibe o painel de recrutador e o loader
        recruiterContainer.classList.remove('search-hidden');
        loaderLog.classList.remove('search-hidden');
        recruiterDashboard.classList.add('search-hidden');
        optionCommandLine.classList.add('search-hidden');
        optionErrorMessage.classList.add('search-hidden');

        // Limpa o loader e inicia animação
        loaderLog.innerHTML = '';
        const logs = [
            '[+] Executing visualizar_cv.sh...',
            '[+] Loading user interface components...',
            '[+] Rendering Visual Terminal Dashboard...'
        ];
        let currentLogIndex = 0;

        function printNextLog() {
            if (currentLogIndex < logs.length) {
                const line = document.createElement('div');
                line.textContent = logs[currentLogIndex];
                loaderLog.appendChild(line);
                currentLogIndex++;
                
                // Delays simulando processamento (300ms, 350ms, 400ms)
                const delays = [300, 350, 400];
                setTimeout(printNextLog, delays[currentLogIndex - 1]);
            } else {
                // Finaliza a inicialização, gera a interface e a exibe
                setTimeout(() => {
                    loaderLog.classList.add('search-hidden');
                    
                    // Renderiza o dashboard ASCII dinamicamente com os dados completos
                    renderRecruiterDashboard();

                    recruiterDashboard.classList.remove('search-hidden');
                    optionCommandLine.classList.remove('search-hidden');
                    optionInput.value = '';
                    updateInputWidth(optionInput);
                    optionInput.focus();
                    isVisualMode = true;
                    isTransitioning = false;
                }, 200);
            }
        }

        printNextLog();
    }

    /**
     * Executa as ações das opções do menu do Recrutador (1 a 5)
     */
    function executeOption(option) {
        if (optionErrorMessage) {
            optionErrorMessage.classList.add('search-hidden');
        }

        switch (option) {
            case '1':
                // Abre o GitHub de Minoru Yamanaka
                window.open('https://github.com/minoru-yamanaka', '_blank');
                optionInput.value = '';
                updateInputWidth(optionInput);
                break;
            case '2':
                // Abre/Baixa o currículo em PDF
                window.open('CV_Minoru_Yamanaka.pdf', '_blank');
                optionInput.value = '';
                updateInputWidth(optionInput);
                break;
            case '3':
                // Baixa o currículo em DOCX
                const docxLink = document.createElement('a');
                docxLink.href = 'CV_Minoru_Yamanaka.docx';
                docxLink.download = 'CV_Minoru_Yamanaka.docx';
                document.body.appendChild(docxLink);
                docxLink.click();
                document.body.removeChild(docxLink);
                optionInput.value = '';
                updateInputWidth(optionInput);
                break;
            case '4':
                // Abre cliente de e-mail para contratação
                window.location.href = 'mailto:minoruyamanka@icloud.com';
                optionInput.value = '';
                updateInputWidth(optionInput);
                break;
            case '5':
                // Sai do Modo Visual
                exitVisualMode();
                break;
            default:
                // Mensagem de erro para opções inválidas
                if (optionErrorMessage) {
                    optionErrorMessage.textContent = '[!] Opção inválida. Digite um número de 1 a 5.';
                    optionErrorMessage.classList.remove('search-hidden');
                    
                    // Limpa o erro e o input após 2 segundos
                    setTimeout(() => {
                        optionErrorMessage.classList.add('search-hidden');
                        optionInput.value = '';
                        updateInputWidth(optionInput);
                    }, 2000);
                }
                break;
        }
    }

    /**
     * Desativa o Modo Visual e retorna ao currículo tradicional
     */
    function exitVisualMode() {
        isVisualMode = false;

        // Oculta a interface de recrutador
        recruiterContainer.classList.add('search-hidden');

        // Exibe o currículo tradicional
        if (container) {
            container.classList.remove('search-hidden');
        }

        // Restaura e foca o terminal superior
        input.value = './visualizar_cv.sh';
        updateInputWidth(input);
        input.focus();
    }
});

/**
 * Ajusta a largura do input dinamicamente baseado na quantidade de caracteres.
 * Utiliza a unidade 'ch' pois a fonte do terminal é monoespaçada.
 */
function updateInputWidth(inputElement) {
    inputElement.style.width = Math.max(1, inputElement.value.length) + 'ch';
}

/**
 * Escapa caracteres especiais para uso seguro em Expressões Regulares.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Percorre recursivamente os nós de texto folha do elemento HTML
 * e substitui as correspondências pela tag <mark class="search-highlight">.
 */
function highlightText(rootElement, term) {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');

    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue;
            if (regex.test(text)) {
                const parent = node.parentNode;
                // Evita destacar dentro de scripts, styles, inputs ou tags mark existentes
                if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'MARK' || parent.tagName === 'INPUT')) {
                    return;
                }
                
                const span = document.createElement('span');
                span.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
                
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, node);
                }
                parent.removeChild(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toUpperCase();
            if (tagName !== 'SCRIPT' && tagName !== 'STYLE' && tagName !== 'INPUT') {
                // Converte para array estático para evitar problemas com mutação do DOM durante o loop
                const children = Array.from(node.childNodes);
                children.forEach(traverse);
            }
        }
    }

    traverse(rootElement);
}

/**
 * Filtra dinamicamente as seções e os elementos internos do currículo.
 * Oculta o conteúdo que não tem correspondências.
 */
function filterElements(mainElement) {
    const sections = mainElement.querySelectorAll('section');

    sections.forEach(section => {
        const marks = section.querySelectorAll('mark.search-highlight');
        
        // Se a seção inteira não tiver correspondência, ela é ocultada
        if (marks.length === 0) {
            section.classList.add('search-hidden');
            return;
        }

        section.classList.remove('search-hidden');

        // Se o título da seção (h3) corresponder, mostramos todo o seu conteúdo
        const h3 = section.querySelector('h3');
        const sectionTitleHasMatch = h3 && h3.querySelectorAll('mark.search-highlight').length > 0;

        // 1. Filtrar blocos de experiência profissional
        const expBlocks = section.querySelectorAll('.experience-block');
        expBlocks.forEach(block => {
            const blockMarks = block.querySelectorAll('mark.search-highlight');
            if (blockMarks.length === 0) {
                if (sectionTitleHasMatch) {
                    block.classList.remove('search-hidden');
                    const timelineItems = block.querySelectorAll('.timeline li');
                    timelineItems.forEach(li => li.classList.remove('search-hidden'));
                } else {
                    block.classList.add('search-hidden');
                }
            } else {
                block.classList.remove('search-hidden');
                
                // Se o cabeçalho da experiência tem correspondência, exibe todos os seus itens da timeline
                const timeline = block.querySelector('.timeline');
                const timelineMarks = timeline ? timeline.querySelectorAll('mark.search-highlight') : [];
                const headerHasMatch = (blockMarks.length - timelineMarks.length) > 0;

                const timelineItems = block.querySelectorAll('.timeline li');
                timelineItems.forEach(li => {
                    if (headerHasMatch || sectionTitleHasMatch) {
                        li.classList.remove('search-hidden');
                    } else {
                        const liMarks = li.querySelectorAll('mark.search-highlight');
                        if (liMarks.length === 0) {
                            li.classList.add('search-hidden');
                        } else {
                            li.classList.remove('search-hidden');
                        }
                    }
                });
            }
        });

        // 2. Filtrar grupos de habilidades
        const skillsGroups = section.querySelectorAll('.skills-group');
        skillsGroups.forEach(group => {
            const groupMarks = group.querySelectorAll('mark.search-highlight');
            if (groupMarks.length === 0) {
                if (sectionTitleHasMatch) {
                    group.classList.remove('search-hidden');
                    const gridItems = group.querySelectorAll('.skills-grid li');
                    gridItems.forEach(li => li.classList.remove('search-hidden'));
                } else {
                    group.classList.add('search-hidden');
                }
            } else {
                group.classList.remove('search-hidden');

                // Se o título do grupo (h4) tem correspondência, exibe a grade inteira
                const h4 = group.querySelector('h4');
                const h4HasMatch = h4 && h4.querySelectorAll('mark.search-highlight').length > 0;

                const gridItems = group.querySelectorAll('.skills-grid li');
                gridItems.forEach(li => {
                    if (h4HasMatch || sectionTitleHasMatch) {
                        li.classList.remove('search-hidden');
                    } else {
                        const liMarks = li.querySelectorAll('mark.search-highlight');
                        if (liMarks.length === 0) {
                            li.classList.add('search-hidden');
                        } else {
                            li.classList.remove('search-hidden');
                        }
                    }
                });
            }
        });

        // 3. Filtrar parágrafos (<p>) soltos na seção
        const paragraphs = section.querySelectorAll('p');
        paragraphs.forEach(p => {
            if (p.closest('.experience-block')) return;

            if (sectionTitleHasMatch) {
                p.classList.remove('search-hidden');
            } else {
                const pMarks = p.querySelectorAll('mark.search-highlight');
                if (pMarks.length === 0) {
                    p.classList.add('search-hidden');
                } else {
                    p.classList.remove('search-hidden');
                }
            }
        });

        // 4. Filtrar itens de lista (<li>) soltos na seção
        const listItems = section.querySelectorAll('li');
        listItems.forEach(li => {
            if (li.closest('.experience-block') || li.closest('.skills-group')) return;

            if (sectionTitleHasMatch) {
                li.classList.remove('search-hidden');
            } else {
                const liMarks = li.querySelectorAll('mark.search-highlight');
                if (liMarks.length === 0) {
                    li.classList.add('search-hidden');
                } else {
                    li.classList.remove('search-hidden');
                }
            }
        });
    });
}

/**
 * Renderiza dinamicamente o texto cru do currículo dentro de uma moldura ASCII.
 * Alinha e quebra linhas de forma automática para manter as bordas laterais do terminal.
 */
function renderRecruiterDashboard() {
    const rawElement = document.getElementById('recruiter-dashboard-raw');
    const dashboardElement = document.getElementById('recruiter-dashboard');
    if (!rawElement || !dashboardElement) return;

    const rawText = rawElement.textContent;
    const boxWidth = 75; // Largura total da caixa ASCII do terminal (mesma largura do exemplo)
    const contentWidth = boxWidth - 4; // Largura disponível para o texto (71 caracteres)

    const lines = rawText.split('\n');
    let formattedLines = [];

    // Adiciona a borda superior inicial da caixa principal
    formattedLines.push('+' + '-'.repeat(boxWidth - 2) + '+');

    lines.forEach((line, index) => {
        // Ignora a primeira e última quebra se forem vazias
        if ((index === 0 || index === lines.length - 1) && line.trim() === '') {
            return;
        }

        const cleanLine = line.trimEnd();

        // Se a linha for vazia
        if (cleanLine.trim() === '') {
            formattedLines.push('| ' + ' '.repeat(contentWidth) + ' |');
            return;
        }

        // Se for a marcação de divisória horizontal
        if (cleanLine.trim() === '[DIVIDER]') {
            formattedLines.push('+' + '-'.repeat(boxWidth - 2) + '+');
            return;
        }

        // Aplica o word wrap na linha para garantir que ela caiba na caixa
        const wrappedLines = wordWrap(cleanLine, contentWidth);
        wrappedLines.forEach(wLine => {
            // Em Javascript, emojis ou alguns caracteres especiais contam de forma diferente
            // na propriedade length. Calculamos o comprimento de exibição visual real.
            // Para strings normais, string.length funciona bem em fontes monoespaçadas.
            const displayLength = wLine.length;
            const padding = Math.max(0, contentWidth - displayLength);
            formattedLines.push('| ' + wLine + ' '.repeat(padding) + ' |');
        });
    });

    // Adiciona a borda inferior final
    formattedLines.push('+' + '-'.repeat(boxWidth - 2) + '+');

    dashboardElement.textContent = formattedLines.join('\n');
}

/**
 * Quebra uma string de texto em múltiplas linhas respeitando o limite máximo
 * de caracteres sem cortar palavras ao meio (word wrap).
 */
function wordWrap(text, maxLength) {
    // Se a linha for menor que o limite, retorna ela diretamente
    if (text.length <= maxLength) {
        return [text];
    }
    
    // Tratamento especial para linhas especiais que não devem sofrer quebras convencionais 
    // ou que já estão pré-alinhadas de forma centralizada/menu
    if (text.startsWith('  📊') || text.startsWith(' [1]')) {
        return [text];
    }

    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length <= maxLength) {
            currentLine = (currentLine + ' ' + word).trim();
        } else {
            if (currentLine !== '') {
                lines.push(currentLine);
            }
            currentLine = word;
            // Se uma palavra individual for maior do que o tamanho máximo, quebra ela
            while (currentLine.length > maxLength) {
                lines.push(currentLine.substring(0, maxLength));
                currentLine = currentLine.substring(maxLength);
            }
        }
    });

    if (currentLine !== '') {
        lines.push(currentLine);
    }

    return lines;
}

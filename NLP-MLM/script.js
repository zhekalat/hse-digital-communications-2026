// Тексты для игры с масками
const texts = [
    {
        title: "Текст 1: Литература",
        content: "Александр Сергеевич Пушкин считается основоположником современного русского литературного языка. Его произведения отличаются глубиной мысли и красотой слога. Роман в стихах «Евгений Онегин» называют энциклопедией русской жизни.",
        masks: [
            { word: "Пушкин", hint: "фамилия поэта" },
            { word: "основоположником", hint: "создатель, зачинатель" },
            { word: "произведения", hint: "творения, работы" },
            { word: "стихах", hint: "поэтическая форма" },
            { word: "энциклопедией", hint: "собрание знаний" }
        ]
    },
    {
        title: "Текст 2: История",
        content: "Великая Отечественная война началась двадцать второго июня тысяча девятьсот сорок первого года. Это было тяжелейшее испытание для советского народа. Битва под Москвой стала первым крупным поражением немецкой армии.",
        masks: [
            { word: "война", hint: "военный конфликт" },
            { word: "началась", hint: "стартовала" },
            { word: "тяжелейшее", hint: "очень трудное" },
            { word: "Москвой", hint: "столица" },
            { word: "поражением", hint: "проигрыш" }
        ]
    },
    {
        title: "Текст 3: Наука",
        content: "Искусственный интеллект способен анализировать большие объемы данных и находить в них закономерности. Машинное обучение позволяет компьютерам учиться на примерах без явного программирования каждого шага.",
        masks: [
            { word: "интеллект", hint: "AI, ум" },
            { word: "анализировать", hint: "изучать, исследовать" },
            { word: "закономерности", hint: "паттерны, правила" },
            { word: "обучение", hint: "ML, learning" },
            { word: "программирования", hint: "написание кода" }
        ]
    },
    {
        title: "Текст 4: Природа",
        content: "Осенью листья деревьев меняют свой цвет с зеленого на желтый и красный. Это происходит из-за разрушения хлорофилла в листьях. Природа готовится к зиме, и все живое замедляет свою активность.",
        masks: [
            { word: "Осенью", hint: "сезон года" },
            { word: "деревьев", hint: "растения" },
            { word: "хлорофилла", hint: "зеленый пигмент" },
            { word: "зиме", hint: "холодный сезон" },
            { word: "активность", hint: "деятельность" }
        ]
    },
    {
        title: "Текст 5: Культура",
        content: "Эрмитаж в Санкт-Петербурге является одним из крупнейших музеев мира. В его коллекции находятся произведения искусства разных эпох и народов. Ежегодно музей посещают миллионы туристов со всего мира.",
        masks: [
            { word: "Эрмитаж", hint: "известный музей" },
            { word: "Санкт-Петербурге", hint: "город на Неве" },
            { word: "музеев", hint: "место хранения искусства" },
            { word: "коллекции", hint: "собрание экспонатов" },
            { word: "туристов", hint: "путешественники" }
        ]
    }
];

let currentTextIndex = 0;
let answers = [];

// Инициализация игры
function init() {
    loadText(0);
    updateTotalTexts();
}

// Загрузка текста
function loadText(index) {
    currentTextIndex = index;
    const text = texts[index];
    
    // Обновляем активную кнопку
    document.querySelectorAll('.text-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // Создаем текст с пропусками
    let maskedText = text.content;
    answers = [];
    
    // Сортируем маски по позиции в тексте (от конца к началу, чтобы не сбивались индексы)
    const sortedMasks = text.masks.map(mask => ({
        ...mask,
        index: maskedText.indexOf(mask.word)
    })).sort((a, b) => b.index - a.index);
    
    sortedMasks.forEach((mask, i) => {
        const actualIndex = text.masks.length - 1 - i;
        answers[actualIndex] = mask.word.toLowerCase();
        
        const replacement = `<span class="masked-word" data-index="${actualIndex}">
            <span class="hint">${mask.hint}</span>
            <input type="text" 
                   class="masked-input" 
                   data-answer="${mask.word.toLowerCase()}"
                   data-index="${actualIndex}"
                   placeholder="______"
                   autocomplete="off">
        </span>`;
        
        maskedText = maskedText.substring(0, mask.index) + 
                    replacement + 
                    maskedText.substring(mask.index + mask.word.length);
    });
    
    document.getElementById('text-container').innerHTML = maskedText;
    document.getElementById('current-text-number').textContent = index + 1;
    
    // Добавляем обработчики событий на поля ввода
    document.querySelectorAll('.masked-input').forEach(input => {
        input.addEventListener('input', updateStats);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswers();
            }
        });
    });
    
    updateStats();
}

// Обновление статистики
function updateStats() {
    const inputs = document.querySelectorAll('.masked-input');
    const filledCount = Array.from(inputs).filter(input => input.value.trim() !== '').length;
    
    document.getElementById('filled-count').textContent = filledCount;
    document.getElementById('total-count').textContent = inputs.length;
}

// Проверка ответов
function checkAnswers() {
    const inputs = document.querySelectorAll('.masked-input');
    let correctCount = 0;
    
    inputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.dataset.answer.toLowerCase();
        
        // Убираем предыдущие классы
        input.classList.remove('correct', 'incorrect', 'revealed');
        
        if (userAnswer === '') {
            return;
        }
        
        // Проверяем точное совпадение или частичное
        if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            correctCount++;
        } else if (correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer)) {
            // Частичное совпадение - тоже считаем правильным
            input.classList.add('correct');
            correctCount++;
        } else {
            input.classList.add('incorrect');
        }
    });
    
    document.getElementById('correct-count').textContent = correctCount;
    
    // Показываем сообщение
    if (correctCount === inputs.length) {
        setTimeout(() => {
            alert('🎉 Отлично! Все ответы правильные!');
        }, 100);
    }
}

// Показать подсказки
function showHints() {
    document.querySelectorAll('.masked-word').forEach(word => {
        word.classList.add('show-hint');
    });
    
    // Скрыть подсказки через 5 секунд
    setTimeout(() => {
        document.querySelectorAll('.masked-word').forEach(word => {
            word.classList.remove('show-hint');
        });
    }, 5000);
}

// Показать правильные ответы
function revealAnswers() {
    const inputs = document.querySelectorAll('.masked-input');
    let correctCount = 0;
    
    inputs.forEach(input => {
        const correctAnswer = input.dataset.answer;
        input.value = correctAnswer;
        input.classList.remove('correct', 'incorrect');
        input.classList.add('revealed');
        correctCount++;
    });
    
    document.getElementById('correct-count').textContent = correctCount;
    updateStats();
}

// Сброс игры
function resetGame() {
    const inputs = document.querySelectorAll('.masked-input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect', 'revealed');
    });
    
    document.querySelectorAll('.masked-word').forEach(word => {
        word.classList.remove('show-hint');
    });
    
    document.getElementById('correct-count').textContent = '0';
    updateStats();
}

// Обновление общего количества текстов
function updateTotalTexts() {
    document.getElementById('total-texts').textContent = texts.length;
}

// Запуск игры при загрузке страницы
window.addEventListener('DOMContentLoaded', init);

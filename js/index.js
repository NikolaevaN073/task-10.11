const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('#colorInput'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

let fruitsJSON = `[
    {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
    {"kind": "Дуриан", "color": "зеленый", "weight": 35},
    {"kind": "Личи", "color": "розово-красный", "weight": 17},
    {"kind": "Карамбола", "color": "желтый", "weight": 28},
    {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

let fruits = JSON.parse(fruitsJSON);
let classColor = [
	{color: 'фиолетовый', class: 'fruit_violet'},
	{color: 'зеленый', class: 'fruit_green'},
	{color: 'розово-красный', class: 'fruit_carmazin'},
	{color: 'желтый', class: 'fruit_yellow'},
	{color: 'светло-коричневый', class: 'fruit_lightbrown'},
];

/*** ОТОБРАЖЕНИЕ ***/

const display = () => {
	fruitsList.innerText = '';	            
	
	for (let i = 0; i < fruits.length; i += 1) {
		
		const li = document.createElement('li');
		li.className = 'fruit__item';	
		li.classList.add(classColor.find(value => value.color === fruits[i].color).class);
		fruitsList.appendChild(li);

		const div = document.createElement('div');
		div.className = 'fruit__info';
		li.appendChild(div);
		
		fruits[i] = {index: i, ...fruits[i]};
		Object.entries(fruits[i]).forEach(([key, value]) => {
			const divItem = document.createElement('div');
			divItem.innerText = key === 'weight' ? `${key}(кг): ${value}` : `${key}: ${value}`;			
			div.appendChild(divItem);
		})			
    }											
};

display();

/*** ПЕРЕМЕШИВАНИЕ ***/

const getRandomInt = (min, max) => {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
};
              
const shuffleFruits = () => {	
	let result = [];	
	while (fruits.length > 0) {			
		let set = new Set();
		while (set.size < fruits.length) {
			key = getRandomInt(0, fruits.length-1);
			set.add(key);   
		}  
		for (n of set) {
			let fruit = fruits.find(item => item.index === n);
			result.push(fruit);
			fruits.splice(fruits.indexOf(fruit), 1);
		}   
	}    	
	fruits = result;	
};

shuffleButton.addEventListener('click', () => {
	try {
		shuffleFruits();			
		display();
	} catch(e) {
		alert('Произошла ошибка!');
	}
});

/*** ФИЛЬТРАЦИЯ ***/

const filterFruits = () => {
	let minValue = document.querySelector('.minweight__input');
	let maxValue = document.querySelector('.maxweight__input');
	let result = fruits.filter(item => item.weight >= minValue.value && item.weight <= maxValue.value);
	fruits = result;
};																		

filterButton.addEventListener('click', () => {
	filterFruits();
	display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = () => {	
	fruits.sort((color1, color2) => {
		if (color1.color === color2.color) return 0;
		return color1.color > color2.color ? 1 : -1;
	})  
};

const sortAPI = {
  	bubbleSort(fruits, comparationColor) {
		for (let i = 0; i < fruits.length - 1; i +=1) {
			for (let j = 0; j < fruits.length - 1 - i; j +=1) {
				if (comparationColor(fruits[j], fruits[j + 1])) {
					let temp = fruits[j + 1];
					fruits[j + 1] = fruits[j];
					fruits[j] = temp;
				}
			}
		}		
		return fruits;	
	},

 	quickSort(fruits) {			 
		function partition(fruits, left, right) {
			var pivot = fruits[Math.floor((right + left) / 2)],
				i = left,
				j = right;
			while (i <= j) {
				while (fruits[i] < pivot) {
					i++;
				}
				while (fruits[j] > pivot) {
					j--;
				}
				if (i <= j) {
					comparationColor(fruits, i, j);
					i++;
					j--;
				}
			}
			return i;
		}						
		let index;
		if (fruits.length > 1) {
			left = typeof left != "number" ? 0 : left;
			right = typeof right != "number" ? fruits.length - 1 : right;
			index = partition(fruits, left, right);				
		}			
		return fruits;					 
	},
	
	startSort(sort, fruits) {
		const start = new Date().getTime();
		sort(fruits, comparationColor);
		const end = new Date().getTime();
		sortTime = `${end - start} ms`;
	},
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
	if (sortKind === 'bubbleSort') {
		sortKindLabel.textContent = 'quickSort';
		sortKind = 'quickSort';
	} else {	
		sortKindLabel.textContent = 'bubbleSort';
		sortKind = 'bubbleSort';
	}  	
});

sortActionButton.addEventListener('click', () => {
	sortTimeLabel.textContent = 'sorting...';	
	const sort = sortAPI[sortKind];
	sortAPI.startSort(sort, fruits);
	display();
	sortTimeLabel.innerText = sortTime;	
});

/*** ДОБАВИТЬ ФРУКТ ***/

function clearInput () {	
	kindInput.value = '';
	colorInput.value = '';
	weightInput.value = '';
}

function checkInput () {
	if (kindInput.value === '' || colorInput.value === '' || weightInput.value === '') {
		alert('Пожалуйста, заполните все поля');		
	} else {
		fruits.push({kind: kindInput.value, color: colorInput.value, weight: weightInput.value});
	} 
}

addActionButton.addEventListener('click', () => {		
	checkInput();
	display();	
	clearInput();
});

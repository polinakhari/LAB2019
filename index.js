'use strict';

const budget = 450,
      goods = {},
      budgetValueElement = document.getElementsByClassName('budget__budget-value')[0],
      goodElements = document.getElementsByClassName('good'),
      basketElement = document.getElementsByClassName('basket')[0],
      basketContainerElement = document.getElementsByClassName('basket__goods-container')[0],
      progressBar = document.getElementsByClassName('basket__progress-bar')[0];
      progressBar.style.width = 0;
let purchaseAmount = 0;

function colorProgressBar(fullness) {
    if (fullness <= 50) {
        progressBar.classList.add('bg-success');
        progressBar.classList.remove('bg-warning');
        progressBar.classList.remove('bg-danger');
    } else if (fullness > 50 && fullness <= 85) {
        progressBar.classList.add('bg-warning');
        progressBar.classList.remove('bg-danger');
        progressBar.classList.remove('bg-success');
    } else {
        progressBar.classList.add('bg-danger');
        progressBar.classList.remove('bg-warning');
        progressBar.classList.remove('bg-success');
    }
}

budgetValueElement.textContent = budget;

for (const goodElement of goodElements) {
    goodElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData(
            'application/json',
            JSON.stringify([event.target.children[3].dataset.price, event.target.id]),
        );
    });
}

basketElement.addEventListener('drop', (event) => {
    const data = event.dataTransfer.getData('application/json');

    if (data) {
        const [price, goodId] = JSON.parse(data);

        basketElement.dispatchEvent(new CustomEvent('order', { detail: { price, goodId } }));
    }
});

basketElement.addEventListener('dragover', event => event.preventDefault());

basketElement.addEventListener('order', ({ detail: { price: stringPrice, goodId } }) => {
    const price = +stringPrice;
    console.log(price);

    if (purchaseAmount + price > budget) {
        alert('Вы исчерпали свой бюджет!');
    } else {
        const orderedGoodElement = document.getElementById(goodId).cloneNode(true);
        let count = 1;

        if (goods[orderedGoodElement.id]) {
            count = ++goods[orderedGoodElement.id];
            const countElement = [...basketContainerElement.children].filter(goodElement => goodElement.children[0].dataset.id === `${goodId}-count`)[0];
            countElement.children[0].textContent = count;
        } else {
            goods[orderedGoodElement.id] = count;
            const counterElement = orderedGoodElement.children[0];
            document.getElementById('info').classList.add("hidden");
            counterElement.dataset.id = counterElement.id;
            counterElement.removeAttribute('id');
            orderedGoodElement.removeAttribute('id');
            orderedGoodElement.setAttribute('draggable', false);
            counterElement.textContent = count;
            basketContainerElement.appendChild(orderedGoodElement);
        }

        purchaseAmount += price;
        const fullness = (purchaseAmount / budget) * 100;
        progressBar.style.width = `${fullness}%`;
        progressBar.innerHTML = `&euro;${purchaseAmount}/` + budget;
        colorProgressBar(fullness);
    }
});

const item = 'item-lista-tarefas';
const moverCima = 'mover-cima';
const moverBaixo = 'mover-baixo';
const textoTarefa = 'texto-tarefa';

const salvarLocalStorage = () => {
  const liTags = document.getElementsByClassName(item);
  const obj = {
    classLists: [],
    texts: [],
  };
  for (let index = 0; index < liTags.length; index += 1) {
    obj.classLists.push(Object.values(liTags[index].classList));
    obj.texts.push(liTags[index].innerText);
  }
  localStorage.setItem('tarefas', JSON.stringify(obj));
};

const criarElemento = (elemento, pai, id, texto) => {
  const elementoNovo = document.createElement(elemento);
  if (id !== '') {
    elementoNovo.id = id;
  }
  if (texto !== '') {
    elementoNovo.innerText = texto;
  }
  if (pai !== '') {
    pai.appendChild(elementoNovo);
  }
  return elementoNovo;
};

const criarHeader = () => {
  const headerTag = document.createElement('header');
  criarElemento('h1', headerTag, '', 'Minha Lista de Tarefas');
  document.getElementsByTagName('body')[0].appendChild(headerTag);
  criarElemento('p', headerTag, 'funcionamento',
    'Clique duas vezes em um item para marcá-lo como completo');
};

const criarMain = () => {
  const mainTag = document.createElement('main');
  criarElemento('input', mainTag, textoTarefa, '');
  criarElemento('button', mainTag, 'criar-tarefa', 'Criar Tarefa');
  criarElemento('button', mainTag, 'apaga-tudo', 'Apagar Tudo');
  criarElemento('button', mainTag, 'remover-finalizados', 'Remover Finalizadas');
  criarElemento('p', mainTag, '', '');
  criarElemento('button', mainTag, 'salvar-tarefas', 'Salvar Tarefas').style.margin = 0;
  criarElemento('button', mainTag, moverCima, '▲');
  criarElemento('button', mainTag, moverBaixo, '▼');
  criarElemento('button', mainTag, 'remover-selecionado', 'Remover Selecionado');
  criarElemento('ol', mainTag, 'lista-tarefas', '');

  document.getElementsByTagName('body')[0].appendChild(mainTag);
};

const estilizarTarefa = (liTag) => {
  const li = liTag;
  li.style.border = '1px solid black';
  li.style.width = '20%';
  li.style.margin = '1% 0';
  li.style.padding = '0 1%';
  li.style.overflowWrap = 'break-word';
  li.style.textDecoration = 'none';
  li.style.backgroundColor = 'white';
  if (li.classList.contains('selected')) li.style.backgroundColor = 'gray';
  if (li.classList.contains('completed')) {
    li.style.textDecoration = 'line-through solid black';
    li.style.border = '3px solid green';
  }
  return li;
};

const criarTarefa = (inputTag) => {
  let input = inputTag;
  const olTag = document.getElementById('lista-tarefas');
  const liTag = criarElemento('li', olTag, '', input);
  liTag.classList.add(item);
  estilizarTarefa(liTag);
  input = document.getElementById(textoTarefa);
  input.value = '';
  return liTag;
};

const selecionarTarefa = (event) => {
  const { target } = event;
  // if (target.classList.contains('selected')) {
  //   target.classList.remove('selected');
  //   estilizarTarefa(target);
  //   return;
  // }
  const antigoSelecionado = document.getElementsByClassName('selected')[0];
  if (antigoSelecionado) {
    antigoSelecionado.classList.remove('selected');
    estilizarTarefa(antigoSelecionado);
  }
  target.classList.add('selected');
  estilizarTarefa(target);
  salvarLocalStorage();
};

const riscarTarefa = (event) => {
  const { target } = event;
  if (target.classList.contains('completed')) {
    target.classList.remove('completed');
    estilizarTarefa(target);
    return;
  }
  target.classList.add('completed');
  estilizarTarefa(target);
};

const apagarTodasAsTarefas = () => {
  const liTags = document.getElementsByTagName('li');
  const tam = liTags.length;
  for (let index = 0; index < tam; index += 1) {
    liTags[0].remove();
  }
};

const apagarTarefasFinalizadas = () => {
  const liTags = document.getElementsByClassName('completed');
  const tam = liTags.length;
  for (let index = 0; index < tam; index += 1) {
    liTags[0].remove();
  }
};

const validarIndex = (event, indexSelecionado, length) => {
  const { target } = event;
  if ((indexSelecionado === 0 && target.id === moverCima)
    || (indexSelecionado === length - 1 && target.id === moverBaixo)) {
    return -1;
  }
  return indexSelecionado;
};

const encontrarSelecionado = (event, tarefas, validacaoDeMovimento) => {
  let indexSelecionado = -1;
  for (let index = 0; index < tarefas.length; index += 1) {
    if (tarefas[index].classList.contains('selected')) indexSelecionado = index;
  }
  if (validacaoDeMovimento) {
    indexSelecionado = validarIndex(event, indexSelecionado, tarefas.length);
  }
  return indexSelecionado;
};

const moverSelecionado = (event) => {
  const { target } = event;
  const tarefas = document.getElementsByClassName(item);
  let indexSelecionado = encontrarSelecionado(event, tarefas, true);
  if (indexSelecionado === -1) return;
  let liAux = '';
  if (target.id === moverCima) indexSelecionado -= 1;
  liAux = tarefas[indexSelecionado].cloneNode(true);
  tarefas[indexSelecionado].remove();
  tarefas[indexSelecionado].after(liAux);
  salvarLocalStorage();
};

const removerSelecionado = () => {
  const selecionado = document.getElementsByClassName('selected')[0];
  if (selecionado) {
    selecionado.remove();
    salvarLocalStorage();
  }
};

const definirCLick = (event) => {
  const { target } = event;
  const { classList } = target;
  const inputTag = document.getElementById(textoTarefa);
  switch (target.id) {
  case 'criar-tarefa':
    criarTarefa(inputTag.value);
    break;
  case 'apaga-tudo':
    apagarTodasAsTarefas();
    break;
  case 'remover-finalizados':
    apagarTarefasFinalizadas();
    break;
  default:
    break;
  }
  if (classList.contains(item)) { selecionarTarefa(event); }
};

const definirDblClick = (event) => {
  const { target } = event;
  if (target.classList.contains(item)) {
    riscarTarefa(event);
    salvarLocalStorage();
  }
};

const recuperarClassesLocalStorage = (index, classesLength, liTag, liTagsRecuperadas) => {
  for (let indexClass = 0; indexClass < classesLength; indexClass += 1) {
    liTag.classList.add(liTagsRecuperadas.classLists[index][indexClass]);
  }
};
const recuperarLocalStorage = () => {
  if (localStorage.getItem('tarefas') !== null) {
    const liTagsRecuperadas = JSON.parse(localStorage.getItem('tarefas'));
    for (let index = 0; index < liTagsRecuperadas.classLists.length; index += 1) {
      const liTag = criarTarefa(liTagsRecuperadas.texts[index]);
      const classes = liTagsRecuperadas.classLists[index];
      recuperarClassesLocalStorage(index, classes.length, liTag, liTagsRecuperadas);
      estilizarTarefa(liTag);
    }
  }
};

const paginaCarregada = () => {
  criarHeader();
  criarMain();
  document.getElementById('salvar-tarefas').addEventListener('click', salvarLocalStorage);
  document.addEventListener('dblclick', definirDblClick);
  document.addEventListener('click', definirCLick);

  const buttonCima = document.getElementById(moverCima);
  const buttonBaixo = document.getElementById(moverBaixo);
  const buttonRemover = document.getElementById('remover-selecionado');
  buttonCima.addEventListener('click', moverSelecionado);
  buttonBaixo.addEventListener('click', moverSelecionado);
  buttonRemover.addEventListener('click', removerSelecionado);
  recuperarLocalStorage();
};

window.addEventListener('load', paginaCarregada);

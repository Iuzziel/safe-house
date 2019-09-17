class GameDisplay extends HTMLElement {
	constructor() {
		super();
		this._shadow = this.attachShadow({ mode: 'open' });

		this._style = document.createElement('style');
		this._style.innerHTML = `
		.container {
			border: 2px solid #dedede;
			background-color: #f1f1f1;
			border-radius: 5px;
			padding: 10px;
			margin: 10px 0;
		}

		.container.ended {
			color: #bbb;
		}

		.container::after {
			content: "";
			clear: both;
			display: table;
		}

		label>span {
			margin-left: .3em;
			margin-right: .3em;
		}

		.time-right {
			float: right;
			color: #aaa;
		}

		.flat-button {
			border: 0;
			margin: 0;
			padding: 0;
			background-color: inherit;
			font-size: 1rem;
			text-align: center;
		}

		.flat-button:hover {
			background-color: rgba(255, 0, 0, 0.5);
		}`;
		this._shadow.appendChild(this._style);

		this._container = document.createElement('div');
		this._container.setAttribute('class', 'container');

		this._gameNameContainer = document.createElement('label');
		this._gameName = document.createElement('span');

		this._isEnded = document.createElement('input');
		this._isEnded.setAttribute('type', 'checkbox');
		this._isEnded.checked = false;
		this._deleteButton = document.createElement('input');
		this._deleteButton.setAttribute('type', 'button');
		this._deleteButton.setAttribute('value', '❌');
		this._deleteButton.setAttribute('class', 'flat-button');
		this._spanTime = document.createElement('span');
		this._spanTime.setAttribute('class', 'time-right');

		this._gameNameContainer.appendChild(this._isEnded);
		this._gameNameContainer.appendChild(this._gameName);

		this._shadow.appendChild(this._container);
		this._container.appendChild(this._gameNameContainer);
		this._container.appendChild(this._deleteButton);
		this._container.appendChild(this._spanTime);
	}

	setGame(game) {
		this._isEnded.checked = game.isover ? true : false;
		this._gameName.textContent = game.name;
		this._spanTime.textContent = game.datecreated;
		this._deleteButton.setAttribute('id-game', game.gid);
		this.toggleEnded();
	}

	getGameId() {
		return Number.parseInt(this._deleteButton.getAttribute('id-game'));
	}

	getDeleteButton() {
		return this._deleteButton;
	}

	isEnded() {
		return this._isEnded;
	}

	toggleEnded() {
		if (this._isEnded.checked)
			this._container.classList.add('ended')
		else
			this._container.classList.remove('ended')
	}
}

customElements.define('game-display', GameDisplay);
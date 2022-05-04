class FireconMultiBtn {
    config = {
        url: 'https://firecon.ru/api/',
        isActive: true,
        moduleClass: 'contacts-standard',
        rootClass: '',
        moduleId: null,

        icons: {
            telegram: 'telegram.png',
            viber: 'viber.png',
            whatsapp: 'whatsapp.png',
            phone: 'phone.png',
            facebook: 'facebook.png',
            youtube: 'youtube.png',
            vkontakte: 'vkontakte.png'
        },
    };

    contacts = [];
    delay = 5;

    constructor(moduleId) {
        if (typeof moduleId == 'string') {
            this.config.moduleId = moduleId;
            try {
                this.init();
            } catch (error) {
                console.error('Firecon Multi Button Boot Error!')
            }
        }
    }

    async init() {
        try {
            await this.getContacts();
        } catch (error) {
            console.error('Firecon Multi Button Fetch Error!')
        }

        switch(Object.keys(this.contacts).length) {
            case 0:
                this.config.moduleClass = 'contacts-disabled';
            case 4:
                this.config.moduleClass = 'contacts-4';
                break;
            case 5:
                this.config.moduleClass = 'contacts-5';
                break;
            case 6:
                this.config.moduleClass = 'contacts-6';
                break;
            case 7:
                this.config.moduleClass = 'contacts-7';
                break;
            default:
                this.config.moduleClass = 'contacts-standard';
                this.config.rootClass = 'less-3';
                break;
        }

        this.render();
    }

    async getContacts() {
        try {
            const response = await fetch(`${this.config.url}module_api/${this.config.moduleId}`);
            
            switch (response.status) {
                case 200:
                    const json = await response.json();
                    this.contacts = json.contacts;
                    this.delay = json.delay;
                    break;
                default:
                   console.log(response.status); 
                   break;
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        // Create root element
        const root = document.createElement('div');
        root.className = `firecon-multi-btn ${this.config.rootClass}`;

        // Create toggle btn
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'firecon-multi-btn__button';
        toggleBtn.innerHTML = `
            <img 
                class="firecon-multy-btn__phone-icon" 
                src="${this.config.url}static/refs/multiBtn/img/firecon-multi-btn-phone-icon.svg"
            >
            <img 
                class="firecon-multy-btn__cross-icon" 
                src="${this.config.url}static/refs/multiBtn/img/cross.svg"
            >
        `;
        // Create phone form
        const phoneForm = document.createElement('div');
        phoneForm.className = 'firecon-phone-popup';
        const phoneFormElement = document.createElement('form');
        try {
            phoneFormElement.innerHTML = `
                <span class="cross">+</span>
                <p class="firecon-phone-popup__header">${this.contacts.phone.phoneText}</p>
                <input 
                    class="firecon-phone-popup__input" 
                    type="phone" name="phone" 
                    placeholder="+7 (999) 999-99-99"
                >
                <button class="firecon-phone-popup__button">${this.contacts.phone.phoneButton}</button>
            `;
        } catch {}


        phoneFormElement.onclick = (event) => {
            event.target.className == 'cross' && document.body.removeChild(phoneForm);
        }

        phoneFormElement.onsubmit = async (event) => {
            event.preventDefault();
            const phoneValue = event.target.phone.value;

            try {
                const promise = await fetch(
                    `${this.config.url}module_api/send_message/${this.config.moduleId}?phone=${phoneValue}`, 
                    {
                        method: 'POST'
                    }
                );

                if (promise.status != 200) {
                    phoneFormElement.innerHTML = `
                        <span class="cross">+</span>
                        <p class="firecon-phone-popup__header">${this.contacts.phone.phoneText}</p>
                        <span class="firecon-notice warn">Ошибка в отправке сообщения!</span>`;
                } else {
                    phoneFormElement.innerHTML = `
                        <span class="cross">+</span>
                        <p class="firecon-phone-popup__header">${this.contacts.phone.phoneText}</p>
                        <span class="firecon-notice success">Ваше сообщение успешно отправлено</span>`;
                }
            } catch (error) {
                console.log(error);
            };
        }

        phoneForm.appendChild(phoneFormElement);
        

        // Create whatsapp imitation
        const whatsappImitation = document.createElement('div');
        whatsappImitation.className = 'whatsapp-imitation';
        const whatsappImitationElement = document.createElement('div')
        whatsappImitationElement.className = 'whatsapp-imitation-messenger'
        const whatsappImitationForm = document.createElement('div')
        whatsappImitationForm.className = 'whatsapp-imitation-form'
        const whatsappImitationFormSuccess = document.createElement('div')
        whatsappImitationFormSuccess.className = 'whatsapp-imitation-form-success'
        try {
            whatsappImitationElement.innerHTML = `
            <span class="cross">+</span>
            <div class="whatsapp-imitation__header">
            <img src="${this.config.url}static/refs/multiBtn/img/firecon-multi-btn-phone-icon.svg" class="whatsapp-imitation__header-logo">
            <div class="whatsapp-imitation__header-text">
            <p class="whatsapp-imitation__header-name">Имя пользователя</p>
            <p class="whatsapp-imitation__header-status">Online</p>
            </div>
            </div>
            <div class="whatsapp-imitation__messages">
            <div class="whatsapp-imitation__message">
            <p class="whatsapp-imitation__message-text">${this.contacts.whatsapp.helloText}</p>
            <p class="whatsapp-imitation__message-time">${new Date().toLocaleTimeString().slice(0,-3)}</p>
            </div>
            <div id="whatsapp__answers" class="whatsapp-imitation__answers">
            </div>
            </div>
            <form class="whatsapp-imitation__form">
            <input  class="whatsapp-imitation__input"
                    type="text" name="text" 
                    id="whatsapp__input"
                    placeholder="Введите текст"
            >
            <button class="whatsapp-imitation__button"> 
            <img src="${this.config.url}static/refs/multiBtn/img/whatsappsend.svg">
            </button>
            </form>
            `;      
        } catch {}
        try {
            whatsappImitationForm.innerHTML = `
            <div class="whatsapp-imitation-form__block">
            <span class="cross-form">+</span>
            <p class="whatsapp-imitation-form__text-header">Отправка сообщения</p>
            <p class="whatsapp-imitation-form__text-ph">Введите номер телефона:</p>
            <form class="whatsapp-imitation-form__form" >
            <input  class="whatsapp-imitation-form__input"
                    type="text" name="form-phone" 
                    placeholder="+7 999 911 99 99"
                    id="form-phone"
                    value=""
            >
            <button>Отправить</button>
            </form>
            </div>
            `
        } catch {}
        try {
            whatsappImitationFormSuccess.innerHTML = `
            <div class="whatsapp-imitation-form-success__block">
            <span class="cross-form-success">+</span>
            <p class="whatsapp-imitation-form-success__text">Сообщение успешно отправлено</p>
            </div>
            `
        } catch {}
        whatsappImitationElement.onclick = (event) => {
            event.target.className == 'cross' && document.body.removeChild(whatsappImitation);
            event.target.className == 'cross-form' && whatsappImitationElement.removeChild(whatsappImitationForm);
            event.target.className == 'cross-form-success' && whatsappImitationElement.removeChild(whatsappImitationFormSuccess);
            event.target.className == 'whatsapp-imitation__answers-answer 2' && whatsappFirstButtonDelete();
            event.target.className == 'whatsapp-imitation__answers-answer 1' && whatsappSecondButtonDelete();
            event.target.className == 'whatsapp-imitation__answers-answer 0' && whatsappThirdButtonDelete();
        }
        whatsappImitationElement.onsubmit = async (event) => {
            event.preventDefault();
            let moduleId = `${this.config.moduleId}`
            let url = `${this.config.url}`
            event.target.className == 'whatsapp-imitation__form' && whatsappImitationElement.appendChild(whatsappImitationForm);
            event.target.className == 'whatsapp-imitation-form__form' && whatsappHandleSubmit(url,moduleId);
            try {
            } catch (error) {
                console.log(error);
            };
        }
        async function whatsappHandleSubmit(url, moduleId) {
            let phone = document.getElementById('form-phone').value
            let message = document.getElementById('whatsapp__input').value
            let promise = await fetch(
                `${url}module_api/send_imitation/${moduleId}`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({
                        phone: phone,
                        msg: message
                    })
                }
            );
            if (promise.status != 200) {
                console.log('Something went wrong')
            } else {
                whatsappImitationElement.removeChild(whatsappImitationForm);
                whatsappImitationElement.appendChild(whatsappImitationFormSuccess);
            }
        }
        function whatsappFirstButtonDelete() {
            document.getElementById('whatsapp__input').value = document.getElementById('whatsapp-answer 2').innerHTML
            document.getElementById('whatsapp-answer 2').remove();
        }
        function whatsappSecondButtonDelete() {
            document.getElementById('whatsapp__input').value = document.getElementById('whatsapp-answer 1').innerHTML
            document.getElementById('whatsapp-answer 1').remove();
        }
        function whatsappThirdButtonDelete() {
            document.getElementById('whatsapp__input').value = document.getElementById('whatsapp-answer 0').innerHTML
            document.getElementById('whatsapp-answer 0').remove();
        }

        whatsappImitation.appendChild(whatsappImitationElement)
        
        // create viber imitation
        const viberImitation = document.createElement('div');
        viberImitation.className = 'viber-imitation';
        const viberImitationElement = document.createElement('div')
        viberImitationElement.className = 'viber-imitation-messenger'
        const viberImitationForm = document.createElement('div')
        viberImitationForm.className = 'viber-imitation-form'
        const viberImitationFormSuccess = document.createElement('div')
        viberImitationFormSuccess.className = 'viber-imitation-form-success'
        try {
            viberImitationElement.innerHTML = `
            <span class="cross">+</span>
            <div class="viber-imitation__header">
            <div class="viber-imitation__header-text">
            <p class="viber-imitation__header-name">Имя пользователя</p>
            <p class="viber-imitation__header-status">Online</p>
            </div>
            </div>
            <div class="viber-imitation__messages">
            <div class="viber-imitation__message">
            <p class="viber-imitation__message-text">${this.contacts.viber.helloText}</p>
            <p class="viber-imitation__message-time">${new Date().toLocaleTimeString().slice(0,-3)}</p>
            </div>
            <div id="viber__answers"class="viber-imitation__answers">
            </div>
            </div>
            <form class="viber-imitation__form">
            <input  class="viber-imitation__input"
                    type="text" name="text" 
                    placeholder="Введите сообщение"
                    value=""
                    id="viber__input"
            >
            <button class="viber-imitation__button"> 
            <img src="${this.config.url}static/refs/multiBtn/img/whatsappsend.svg">
            </button>
            </form>
            `;      
        } catch {}
        try {
            viberImitationForm.innerHTML = `
            <div class="viber-imitation-form__block">
            <span class="cross-form">+</span>
            <p class="viber-imitation-form__text-header">Отправка сообщения</p>
            <p class="viber-imitation-form__text-ph">Введите номер телефона:</p>
            <form class="viber-imitation-form__form" >
            <input  class="viber-imitation-form__input"
                    type="text" name="form-phone" 
                    placeholder="+7 999 911 99 99"
                    id="form-phone"
            >
            <button>Отправить</button>
            </form>
            </div>
            `
        } catch {}
        try {
            viberImitationFormSuccess.innerHTML = `
            <div class="viber-imitation-form-success__block">
            <span class="cross-form-success">+</span>
            <p class="viber-imitation-form-success__text">Сообщение успешно отправлено</p>
            </div>
            `
        } catch {}
        viberImitationElement.onclick = (event) => {
            event.target.className == 'cross' && document.body.removeChild(viberImitation);
            event.target.className == 'cross-form' && viberImitationElement.removeChild(viberImitationForm);
            event.target.className == 'cross-form-success' && viberImitationElement.removeChild(viberImitationFormSuccess);
            event.target.className == 'viber-imitation__answers-answer 2' && viberFirstButtonDelete();
            event.target.className == 'viber-imitation__answers-answer 1' && viberSecondButtonDelete();
            event.target.className == 'viber-imitation__answers-answer 0' && viberThirdButtonDelete();
        }
        viberImitationElement.onsubmit = async (event) => {
            event.preventDefault();
            let moduleId = `${this.config.moduleId}`
            let url = `${this.config.url}`
            event.target.className == 'viber-imitation__form' && viberImitationElement.appendChild(viberImitationForm);
            event.target.className == 'viber-imitation-form__form' && viberHandleSubmit(url,moduleId);
            try {
            } catch (error) {
                console.log(error);
            };
        }
        async function viberHandleSubmit(url, moduleId) {
            let phone = document.getElementById('form-phone').value
            let message = document.getElementById('viber__input').value
            let promise = await fetch(
                `${url}module_api/send_imitation/${moduleId}`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({
                        phone: phone,
                        msg: message
                    })
                }
            );
            if (promise.status != 200) {
                console.log('Something went wrong')
            } else {
                viberImitationElement.removeChild(viberImitationForm);
                viberImitationElement.appendChild(viberImitationFormSuccess);
            }
        }
        function viberFirstButtonDelete() {
            document.getElementById('viber__input').value = document.getElementById('viber-answer 2').innerHTML
            document.getElementById('viber-answer 2').remove();
        }
        function viberSecondButtonDelete() {
            document.getElementById('viber__input').value = document.getElementById('viber-answer 1').innerHTML
            document.getElementById('viber-answer 1').remove();
        }
        function viberThirdButtonDelete() {
            document.getElementById('viber__input').value = document.getElementById('viber-answer 0').innerHTML
            document.getElementById('viber-answer 0').remove();
        }
        viberImitation.appendChild(viberImitationElement)
        // Create whatsapp imitation
        const telegramImitation = document.createElement('div');
        telegramImitation.className = 'telegram-imitation';
        const telegramImitationElement = document.createElement('div')
        telegramImitationElement.className = 'telegram-imitation-messenger'
        const telegramImitationForm = document.createElement('div')
        telegramImitationForm.className = 'telegram-imitation-form'
        const telegramImitationFormSuccess = document.createElement('div')
        telegramImitationFormSuccess.className = 'telegram-imitation-form-success'
        try {
            telegramImitationElement.innerHTML = `
            <span class="cross">+</span>
            <div class="telegram-imitation__header">
            <div class="telegram-imitation__header-text">
            <img src="${this.config.url}static/refs/multiBtn/img/firecon-multi-btn-phone-icon.svg" class="telegram-imitation__header-logo">
            <p class="telegram-imitation__header-name">Имя пользователя</p>
            <p class="telegram-imitation__header-status">Online</p>
            </div>
            </div>
            <div class="telegram-imitation__messages">
            <div class="telegram-imitation__message">
            <p class="telegram-imitation__message-text">${this.contacts.telegram.helloText}</p>
            <p class="telegram-imitation__message-time">${new Date().toLocaleTimeString().slice(0,-3)}</p>
            </div>
            <div id="telegram__answers" class="telegram-imitation__answers">
            </div>
            </div>
            <form class="telegram-imitation__form">
            <input  class="telegram-imitation__input"
                    type="text" name="text" 
                    id="telegram__input"
                    placeholder="Написать сообщение..."
            >
            <button value="" type="submit" class="telegram-imitation__button">
            <img src="${this.config.url}static/refs/multiBtn/img/telegramsend.svg"> 
            </button>
            </form>
            `;      
        } catch {}
        try {
            telegramImitationForm.innerHTML = `
            <div class="telegram-imitation-form__block">
            <span class="cross-form">+</span>
            <p class="telegram-imitation-form__text-header">Отправка сообщения</p>
            <p class="telegram-imitation-form__text-ph">Введите номер телефона:</p>
            <form class="telegram-imitation-form__form" >
            <input  class="telegram-imitation-form__input"
                    type="text" name="form-phone" 
                    placeholder="+7 999 911 99 99"
                    id="form-phone"
                    >
            <button>Отправить</button>
            </form>
            </div>
            `
        } catch {}
        try {
            telegramImitationFormSuccess.innerHTML = `
            <div class="telegram-imitation-form-success__block">
            <span class="cross-form-success">+</span>
            <p class="telegram-imitation-form-success__text">Сообщение успешно отправлено</p>
            </div>
            `
        } catch {}
        telegramImitationElement.onclick = (event) => {
            event.target.className == 'cross' && document.body.removeChild(telegramImitation);
            event.target.className == 'cross-form' && telegramImitationElement.removeChild(telegramImitationForm);
            event.target.className == 'cross-form-success' && telegramImitationElement.removeChild(telegramImitationFormSuccess);
            event.target.className == 'telegram-imitation__answers-answer 2' && telegramFirstButtonDelete();
            event.target.className == 'telegram-imitation__answers-answer 1' && telegramSecondButtonDelete();
            event.target.className == 'telegram-imitation__answers-answer 0' && telegramThirdButtonDelete();
        }
        telegramImitationElement.onsubmit = async (event) => {
            event.preventDefault();
            let moduleId = `${this.config.moduleId}`
            let url = `${this.config.url}`
            try {
            event.target.className == 'telegram-imitation__form' && telegramImitationElement.appendChild(telegramImitationForm);
            event.target.className == 'telegram-imitation-form__form' && telegramHandleSubmit(url,moduleId);
            } catch (error) {
                console.log(error);
            };
        }
        async function telegramHandleSubmit(url, moduleId) {
            let phone = document.getElementById('form-phone').value
            let message = document.getElementById('telegram__input').value
            let promise = await fetch(
                `${url}module_api/send_imitation/${moduleId}`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({
                        phone: phone,
                        msg: message
                    })
                }
            );
            if (promise.status != 200) {
                console.log('Something went wrong')
            } else {
                telegramImitationElement.removeChild(telegramImitationForm);
                telegramImitationElement.appendChild(telegramImitationFormSuccess);
            }
        }

        function telegramFirstButtonDelete() {
            document.getElementById('telegram__input').value = document.getElementById('telegram-answer 2').innerHTML
            document.getElementById('telegram-answer 2').remove();
        }
        function telegramSecondButtonDelete() {
            document.getElementById('telegram__input').value = document.getElementById('telegram-answer 1').innerHTML
            document.getElementById('telegram-answer 1').remove();
        }
        function telegramThirdButtonDelete() {
            document.getElementById('telegram__input').value = document.getElementById('telegram-answer 0').innerHTML
            document.getElementById('telegram-answer 0').remove();
        }
        
        telegramImitation.appendChild(telegramImitationElement)


        // Create contacts
        const contactList = document.createElement('div');
        contactList.className = `firecon-multi-btn__contacts ${this.config.moduleClass}`;
        
        const contacts = Object.keys(this.contacts);

        contacts.forEach(element => {
            const contactItem = document.createElement('button');
            contactItem.className = "firecon-multi-btn__contacts-item";


            if ((element != 'phone') && (element != 'viber') && (element != 'telegram') && (element != 'whatsapp')){
                const aTag = document.createElement('a');

                let href = this.contacts[element];
                // switch(element) {
                //     case "telegram":
                //         href = `https://t.me/${this.contacts[element]}`;
                //         break;
                //     case "whatsapp":
                //         href = `https://wa.me/${this.contacts[element]}`;
                //         break;
                //     case "viber":
                //         href = `viber://chat?number=${this.contacts[element]}`;
                //         break;
                // }
                
                aTag.href = href;
                aTag.target = '_blank';

                aTag.innerHTML = `
                    <img 
                        class="firecon-multi-btn__contacts-icon" 
                        src="${this.config.url}static/refs/multiBtn/img/${this.config.icons[element]}"
                    >
                `;

                contactItem.appendChild(aTag);
            }

            if (element == 'phone') {
                contactItem.onclick = () => {
                    const parentActive = document.querySelector('.firecon-multi-btn__contacts._active .firecon-multi-btn__contacts-item a ');
                    
                    if (parentActive) {
                        element === 'phone' && document.body.appendChild(phoneForm);
                    }
                }

                contactItem.innerHTML = `
                    <img 
                        class="firecon-multi-btn__contacts-icon" 
                        src="${this.config.url}static/refs/multiBtn/img/${this.config.icons[element]}"
                    >
                `;
        
            }
            if (element == 'whatsapp') {
                if (this.contacts.whatsapp.mode == 'LINK') {
                    contactItem.onclick = () => {
                        let href = this.contacts.whatsapp.link;
                        window.open(`viber://chat?number=${href}`) 
                    }
                } else {
                    contactItem.onclick = () => {
                        const parentActive = document.querySelector('.firecon-multi-btn__contacts._active .firecon-multi-btn__contacts-item a');
                        
                        if (parentActive) {
                            element === 'whatsapp' && document.body.appendChild(whatsappImitation);
                        }
                        let isAnyAnswers = document.getElementById('whatsapp-answer 0')
                        if (isAnyAnswers) {
                            return
                        } else {
                        const whatsappDefaultAnswers = (this.contacts.whatsapp.defaultAnswers)
                        const whatsappFilteredAnswers = whatsappDefaultAnswers.filter(item => item.length > 1);
                        let defaultAnswers = document.getElementById('whatsapp__answers')
                        whatsappFilteredAnswers.forEach((item, index) => {
                            defaultAnswers.insertAdjacentHTML('afterbegin',
                            `
                            <button id="whatsapp-answer ${index}"class="whatsapp-imitation__answers-answer ${index}">${item}</button>
                            `)
                        })
                        }
                    }
                }

                contactItem.innerHTML = `
                    <img 
                        class="firecon-multi-btn__contacts-icon" 
                        src="${this.config.url}static/refs/multiBtn/img/${this.config.icons[element]}"
                    >
                `;
        
            }
            if (element == 'viber') {
                if (this.contacts.viber.mode == 'LINK') {
                    contactItem.onclick = () => {
                        let href = this.contacts.viber.link;
                        window.open(`viber://chat?number=${href}`) 
                    }
                } else {
                    contactItem.onclick = () => {
                        const parentActive = document.querySelector('.firecon-multi-btn__contacts._active .firecon-multi-btn__contacts-item a');
                        
                        if (parentActive) {
                            element === 'viber' && document.body.appendChild(viberImitation);
                        }
                        let isAnyAnswers = document.getElementById('viber-answer 0')
                        if (isAnyAnswers) {
                            return
                        } else {
                        const viberDefaultAnswers = (this.contacts.viber.defaultAnswers)
                        const viberFilteredAnswers = viberDefaultAnswers.filter(item => item.length > 1);
                        let defaultAnswers = document.getElementById('viber__answers')
                        viberFilteredAnswers.forEach((item, index) => {
                            defaultAnswers.insertAdjacentHTML('afterbegin',
                            `
                            <button id="viber-answer ${index}"class="viber-imitation__answers-answer ${index}">${item}</button>
                            `)
                        })
                        }
                    }
                }

                contactItem.innerHTML = `
                    <img 
                        class="firecon-multi-btn__contacts-icon" 
                        src="${this.config.url}static/refs/multiBtn/img/${this.config.icons[element]}"
                    >
                `;
        
            }
            if (element == 'telegram') {
                if (this.contacts.telegram.mode == 'LINK') {
                    contactItem.onclick = () => {
                        let href = this.contacts.telegram.link;
                        window.open(`https://t.me/${href}`) 
                    }
                } else {
                    contactItem.onclick = () => {
                        const parentActive = document.querySelector('.firecon-multi-btn__contacts._active .firecon-multi-btn__contacts-item a');
                        
                        if (parentActive) {
                            element === 'telegram' && document.body.appendChild(telegramImitation);
                        }
                        let isAnyAnswers = document.getElementById('telegram-answer 0')
                        if (isAnyAnswers) {
                            return
                        } else {
                        const telegramDefaultAnswers = (this.contacts.telegram.defaultAnswers)
                        const telegramFilteredAnswers = telegramDefaultAnswers.filter(item => item.length > 1);
                        let defaultAnswers = document.getElementById('telegram__answers')
                        telegramFilteredAnswers.forEach((item, index) => {
                            defaultAnswers.insertAdjacentHTML('afterbegin',
                            `
                            <button id="telegram-answer ${index}"class="telegram-imitation__answers-answer ${index}">${item}</button>
                            `)
                        })
                        }
                    }
                }

                contactItem.innerHTML = `
                    <img 
                        class="firecon-multi-btn__contacts-icon" 
                        src="${this.config.url}static/refs/multiBtn/img/${this.config.icons[element]}"
                    >
                `;
        
            }
        
            contactList.appendChild(contactItem);
        });

        toggleBtn.onclick = () => {
            toggleBtn.classList.toggle('_cross');
            contactList.classList.toggle('_active');
        }

        // Append Module in DOM
        root.appendChild(toggleBtn);
        root.appendChild(contactList);

        setTimeout(()=> {
            document.body.appendChild(root);
        }, this.delay * 1000)
        
        // Append CSS in DOM
        const css = document.createElement('link');
        css.rel = "stylesheet" 
        css.href = this.config.url + "static/refs/multiBtn/css/style.css";

        document.head.appendChild(css);
    }
}
// disable loop projection for async while loop in form command
if (window.CP && window.CP.PenTimer) {
  window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = Number.POSITIVE_INFINITY;
}

// better formatting
$.terminal.defaults.allowedAttributes.push('style');

$.terminal.new_formatter([
  /<big>(.*?)<\/big>/g,
  '[[;;;;;{"style": "--size: 1.5;letter-spacing: 2px"}]$1]',
]);

$.terminal.new_formatter([
  /<img src="([^"]+)"(?: alt="([^"]+)")?\/?>/g,
  '[[@;;;;$1]$2]',
]);
$.terminal.new_formatter([/<a href="([^"]+)">([^>]+)<\/a>/g, '[[!;;;;$1]$2]']);

function is_object(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

const MSG_WELCOME = (name) => `Welcome, ${name}! \nWe at OfficeRnD in cooperation with Vault-Tec corp. invite you to a top secret research facility for an epic challenge! Armed with a Vault Dweller Survival Guide, endless supply of Nuka-Cola, an access token to our mainframe, and your very own Pip-Boy, you'll team up with fellow Dwellers to innovate and create a state-of-the-art AI assistant designed to make life in the Vault more efficient and enjoyable. You have three days to harness your skills, creativity, and teamwork to build an AI that will revolutionize Vault life. Are you ready to <bold>apply</bold> or you need some <bold>help</bold> first?`

const MSG_WHERE = `<bold>Locations</bold>
====================================================================================
BG Vault dwellers: <bold>SYNERGY TOWER</bold> | 42.67024292540808, 23.37190250574886
US Vault dwellers: <bold>ONLINE</bold>        | 127.0.0.1
UK Vault dwellers: <bold>ONLINE</bold>        | 127.0.0.1
AU Vault dwellers: <bold>ONLINE</bold>        | 127.0.0.1
====================================================================================`;

const MSG_WHEN = `<bold>Opening</bold>
==========================================
US/CDT  | <bold>TUE, 8 OCT 2024, 0800</bold>
US/EDT  | <bold>TUE, 8 OCT 2024, 0900</bold>
UK/BST  | <bold>TUE, 8 OCT 2024, 1400</bold>
BG/EEST | <bold>TUE, 8 OCT 2024, 1600</bold>
AU/AEDT | <bold>WED, 9 OCT 2024, 1000</bold>
==========================================`;
var login;

var term = $('.term').terminal(
  {
    apply: function () {
      const { input, password, radio, boolean, checkboxes } =
        $.terminal.forms.types;

      var spec = [
        {
          type: input,
          message: '\nEnter name:',
          prompt: '> ',
          name: 'name',
        },
        {
          type: radio,
          message: '\nHow would you like to participate (use up/down arrows):',
          items: {
            'I have an idea for a project': 'I+have+an+idea+for+a+project',
            'I am part of a project': 'I+am+part+of+a+project',
            'I am looking for a project to join':
              'I+am+looking+for+a+project+to+join',
          },
          name: 'lead',
        },
        {
          type: input,
          message: '\nProject name (optional):',
          prompt: '> ',
          name: 'project',
        },
        {
          type: input,
          message: '\nProject description (optional):',
          prompt: '> ',
          name: 'description',
        },
        {
          type: checkboxes,
          message:
            '\nDo you need additional hardware? (up/down to navigate, spacebar to select):',
          items: {
            monitor: 'monitor',
            keyboard: 'keyboard',
          },
          name: 'hardware',
        },
        {
          type: input,
          message:
            'List the names of the AI tools and services you might need, e.g ChatGPT, Claude. (optional):',
          prompt: '> ',
          name: 'tokens',
        },
      ];
      if (!login) {
        this.echo(`Unauthorized, <bold>login</bold> first.`);
        return;
      }

      $.terminal.forms.form(this, spec).then((form) => {
        var url = `https://docs.google.com/forms/d/e/1FAIpQLSf6GclEs2HiMklMgpLTqBcvzj55RCUd3ET4YEoQ7mIp-BVQWg/viewform?usp=pp_url&entry.1924402208=${
          form.name
        }&entry.1214506897=${form.lead}&entry.1121891112=${
          form.project
        }&entry.2028719980=${form.description}&entry.1928412934=${
          form.hardware.indexOf('monitor') > -1 ? 'Monitor' : undefined
        }&entry.1928412934=${
          form.hardware.indexOf('keyboard') > -1 ? 'Keyboard' : undefined
        }&entry.1393140207=${form.tokens}`;

        this.typing(
          'echo',
          20,
          `Thank you, ${form.name}! \nYou will need to confirm this form before our council contacts you.`
        )
          .then(() => this.typing('echo', 250, 'Redirecting......'))
          .then(() => window.open(url, '_blank'))
          .then(() => this.echo(`or follow [[!;;;;${url}]this link]`));
      });
    },
    help: function (...args) {
      this.echo('Available commands: \n<bold>help</bold> \n<bold>apply</bold> \n<bold>when</bold> \n<bold>where</bold>');
    },
    login: function (...args) {
      if (login) {
        this.echo(`Logged in as ${login}`);
        return;
      }
      if (args.length < 1) {
        this.echo(`login expects 1 argument, got ${args.length}; try "login your name"`);
      } else {
        login = args.join(' ');
        this.echo('Enter password');
        this.typing('echo', 150, '> **********').then(() => this.typing('echo',10, MSG_WELCOME(login)));
      }
    },
    when: function (...args) {
      this.typing('echo', 10, MSG_WHEN);
    },
    where: function (...args) {
      this.typing(
        'echo',
        10, MSG_WHERE
      );
    },
  },
  {
    name: 'forms',
    greetings: `<big>WELCOME TO OFFICERND (TM) TERMLINK PROTOCOL</big>\n`,
    completion: true,
    onInit: function () {
      this.typing('echo', 10, 'Establishing connection, please wait...')
        .then(() =>
          this.typing('echo', 10, '==========================================')
        )
        .then(() =>
          this.echo('Connection established. \nPlease <bold>login</bold> first.')
        );
    },
    onCommandNotFound: function (cmd) {
      this.error(`Command ${cmd} not found! Try help instead.`);
    },
    renderHandler: function (val) {
      //workaround for scroll issue with forms
      setTimeout(() => {
        $('.term-wrapper').scrollTop($('.term-wrapper').height() + 50);
      }, 100);
      if (is_object(val) || Array.isArray(val)) {
        return JSON.stringify(val, true, 4);
      }
      return val;
    },
    checkArity: false,
  }
);

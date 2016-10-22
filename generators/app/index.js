const path       = require('path');
const yosay      = require('yosay');
const to         = require('to-case');
const generators = require('yeoman-generator');
const moment = require('moment');
/**
 * initializing, prompting, configuring, default, writing, conflicts, install, end
 */
/**
 * 用户输入信息:
 *  projectName, version, description, author
 */

module.exports = generators.Base.extend({
  initializing: {
    welcome() {
      this.log(yosay(
        '\'Allo \'allo! Out of the box I include Express and Mongoose, as well as a' +
        'few other goodies, to build your rest api Server.'
      ));
    },
    showTime() {
      moment().format('L');
    }
  },
  prompting: {
    log() {
      this.log('start prompting');
    },
    ask() {
      return this.prompt([
        {
          name    : 'projectName',
          type    : 'input',
          message : 'your project name(default is the current folder name):',
          filter  : (answer) => to.slug(answer),
          default : path.basename(this.destinationPath())
        },
        {
          name: 'projectVersion',
          type: 'input',
          message: 'your project version:',
          default: '1.0.0'
        },
        {
          name: 'projectDescription',
          type: 'input',
          message: 'project description:',
          filter: (answer) => to.title(answer),
          default: ''
        },
        {
          name: 'projectAuthor',
          type: 'input',
          message: 'author:',
          filter: (answer) => to.capital(answer),
          default: ''
        }
      ]).then(answers => {
        this.projectName = answers.projectName;
        this.projectVersion = answers.projectVersion;
        this.projectDescription = answers.projectDescription;
        this.projectAuthor = answers.projectAuthor;
      });
    }
  },
  addToDef() {
    this.log('should add to default and run after configuring');
  },
  configuring: {
    config() {
      this.log('starting run configuring');
      this.createTime = moment().format('L');
    }
  },
  default() {
    this.log('start run default');
  },
  writing: {
    log() {
      this.log('start run writing');
    },
    package() {
      this.fs.copyTpl(
        this.templatePath('package.template'),
        this.destinationPath('package.json'), {
          projectName   : this.projectName,
          projectVersion : this.projectVersion,
          projectDescription: this.projectDescription,
          projectAuthor: this.projectAuthor
        }
      );
    },
    readme() {
      this.fs.copyTpl(
        this.templatePath('README.template'),
        this.destinationPath('README.md'), {
          projectName   : this.projectName,
          projectDescription: this.projectDescription
        }
      );
    },
    makefile() {
      this.fs.copy(
        this.templatePath('Makefile.template'),
        this.destinationPath('Makefile')
      );
    },
    gitignore() {
      this.fs.copy(
        this.templatePath('gitignore.template'),
        this.destinationPath('.gitignore')
      );
    },
    eslintrc() {
      this.fs.copy(
        this.templatePath('eslintrc.template'),
        this.destinationPath('.eslintrc')
      );
    },
    babelrc() {
      this.fs.copy(
        this.templatePath('babelrc.template'),
        this.destinationPath('.babelrc')
      );
    },
    npmignore() {
      this.fs.copy(
        this.templatePath('npmignore.template'),
        this.destinationPath('.npmignore')
      );
    },
    gulpfile() {
      this.fs.copyTpl(
        this.templatePath('gulpfile.template'),
        this.destinationPath('gulpfile.js'), {
          time: this.createTime
        }
      );
    },
    webpackfile() {
      this.fs.copyTpl(
        this.templatePath('webpack.config.template'),
        this.destinationPath('webpack.config.js'), {
          time: this.createTime
        }
      );
    },
    logfile() {
      this.fs.copyTpl(
        this.templatePath('logs/'),
        this.destinationPath('logs/'), {
          time: this.createTime
        }
      );
    },
    srcfile() {
      this.fs.copyTpl(
        this.templatePath('src/'),
        this.destinationPath('src/'), {
          time: this.createTime
        }
      );
    },
    testfile() {
      this.fs.copyTpl(
        this.templatePath('test/'),
        this.destinationPath('test/'), {
          time: this.createTime
        }
      );
    }
  },
  install() {
    this.log('start install');
  },
  end() {
    this.log('end');
  }
});

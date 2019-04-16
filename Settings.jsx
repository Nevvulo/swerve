const { React } = require('powercord/webpack');
const { TextInput } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);

    const get = props.settings.get.bind(props.settings);
    this.plugin = powercord.pluginManager.get('swerve');
    this.state = {
      isWordSetValid: true,
      words: get('words', [])
    };
  }

  render () {
    return (
      <div>
        <TextInput
          onChange={(e) => {
            const words = e.split('|').filter(Boolean);
            if (words.some(word => word.length < 4)) {
              return this.setState({ isWordSetValid: false });
            }
            this._set('words', words.length ? words : this.plugin.defaultWords.join('|'));
            this.setState({ isWordSetValid: true });
          }}
          defaultValue={this.state.words.length ? this.state.words : this.plugin.defaultWords.join('|')}
          note='Delimit new words with pipes (|). Words must be longer than 3 characters.'
          style={!this.state.isWordSetValid ? { borderColor: '#e53935' } : {}}
        >
          Words to censor
        </TextInput>
      </div>
    );
  }

  _set (key, value = !this.state[key], defaultValue) {
    if (!value && defaultValue) {
      value = defaultValue;
    }

    this.props.settings.set(key, value);
    this.setState({ [key]: value });
  }
};

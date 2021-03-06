const PropTypes = require('prop-types')
const {PureComponent} = require('react')
const h = require('react-hyperscript')
const {qrcode: qrCode} = require('qrcode-npm')
const {connect} = require('react-redux')
const {isHexPrefixed} = require('ethereumjs-util')
const CopyButton = require('./components/copy/copy-button')
const { toChecksumAddress, ifXDC } = require('./util')

class AccountQrScreen extends PureComponent {
  static defaultProps = {
    warning: null,
  }

  static propTypes = {
    Qr: PropTypes.object.isRequired,
    warning: PropTypes.node,
    network: PropTypes.string,
  }

  render () {
    const {Qr, warning, network} = this.props
    const addressChecksum = toChecksumAddress(network, Qr.data)
    const address = ifXDC ? addressChecksum : `${isHexPrefixed(Qr.data) ? 'ethereum:' : ''}${Qr.data}`
    const qrImage = qrCode(4, 'M')

    qrImage.addData(address)
    qrImage.make()

    return h('.main-container.flex-column', {
      key: 'qr',
      style: {
        justifyContent: 'center',
        paddingBottom: '45px',
        paddingLeft: '45px',
        paddingRight: '45px',
        alignItems: 'center',
      },
    }, [

      warning ? h('span.error.flex-center', warning) : null,

      h('#qr-container.flex-column', {
        style: {
          marginTop: '15px',
        },
        dangerouslySetInnerHTML: {
          __html: qrImage.createTableTag(4),
        },
      }),
      h('.qr-header', Qr.message),
      h('.flex-row', [
        h('h3.ellip-address', {
          style: {
            width: '247px',
          },
        }, addressChecksum),
        h(CopyButton, {
          value: addressChecksum,
        }),
      ]),
    ])
  }
}

function mapStateToProps (state) {
  return {
    Qr: state.appState.Qr,
    warning: state.appState.warning,
    network: state.metamask.network,
  }
}

module.exports = connect(mapStateToProps)(AccountQrScreen)

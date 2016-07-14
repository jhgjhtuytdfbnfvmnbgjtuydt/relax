import bind from 'decorators/bind';
import ElementEmpty from 'components/element-empty';
import ElementLoading from 'components/element-loading';
import ElementNotFound from 'components/element-not-found';
import React, {PropTypes} from 'react';

import settings from './settings';
import Component from '../component';
import Element from '../element';

export default class DynamicListContainer extends Component {
  static fragments = {
    symbol: {
      _id: 1,
      title: 1,
      data: 1
    }
  };

  static propTypes = {
    symbol: PropTypes.object,
    symbolId: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    relax: PropTypes.object.isRequired,
    editSymbol: PropTypes.func.isRequired,
    editing: PropTypes.bool,
    editData: PropTypes.object
  };

  @bind
  onEdit () {
    const {relax, symbolId, symbol, editSymbol} = this.props;

    if (symbolId && symbol && symbol.data) {
      editSymbol(relax.element.id, symbol.data);
    }
  }

  render () {
    const {relax} = this.props;
    const props = {
      htmlTag: 'div',
      ...relax,
      settings
    };

    if (relax.editing) {
      props.onDoubleClick = this.onEdit;
    }

    return (
      <Element {...props}>
        {this.renderContent()}
      </Element>
    );
  }

  renderContent () {
    const {loading, symbolId, symbol} = this.props;
    let result;

    if (loading) {
      result = this.renderLoading();
    } else if (!symbolId) {
      result = this.renderEmpty();
    } else if (symbol && symbol.data) {
      result = this.renderSymbol();
    } else {
      result = this.renderNotFound();
    }

    return result;
  }

  renderLoading () {
    return (
      <ElementLoading>Symbol Loading</ElementLoading>
    );
  }

  renderEmpty () {
    return (
      <ElementEmpty>Select a symbol</ElementEmpty>
    );
  }

  renderSymbol () {
    const {symbol, relax, editing, editData} = this.props;
    const content = relax.renderElement({
      customData: editData || symbol.data,
      editing
    }, 'base', 0);
    let result;

    if (relax.editing && !editing) {
      result = (
        <div onDoubleClick={this.onEdit}>{content}</div>
      );
    } else {
      result = content;
    }

    return result;
  }

  renderNotFound () {
    return (
      <ElementNotFound>Symbol not found</ElementNotFound>
    );
  }
}
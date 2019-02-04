import React from 'react';
import { View, Text } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import { SearchBar, FilterButton } from '../../../_reusable';

import { BackButton } from '../../../_common';
import { STATUS_BAR_HEIGHT } from '../../../../Helpers';

import {
  strings,
  translate
} from '../../../../i18n.js';


const SearchHeader = ({
  reference,
  searchQuery,
  onQueryDidChange,
  onSubmitEditing,
  onFocus,
  onFilterPress,
  onFilterValueSelected,
  radioProps,
  showFilter
}) => (
  <View
    style={{
        paddingTop: STATUS_BAR_HEIGHT + 5,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderColor: '#EFF0F2',
        backgroundColor: '#FCFDFF',
        flexDirection: 'row',
        alignItems: 'center'
    }}
  >
      <BackButton />
      <SearchBar
        reference={reference}
        color={'#8e8e9359'}
        containerStyle={{ flex: 1, marginRight: 16 }}
        placeholder={strings('StoreSearch.placeholder', { seller_name: translate(this.props.seller.display_name) })}
        searchQuery={searchQuery}
        onQueryDidChange={onQueryDidChange}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
      />
  </View>
);

export { SearchHeader };

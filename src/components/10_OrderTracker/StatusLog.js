import React from 'react';
import { Image, View, ActivityIndicator } from 'react-native';
import {
  AYEZ_GREEN
} from '../../Helpers.js';

import {
  strings,
  translate,
  formatTimestamp
} from '../../i18n.js';

import {
  AyezText
} from '../_common';


const checked_icon = require('../../../assets/images_v2/OrderTracker/checked.png');
const unchecked_icon = require('../../../assets/images_v2/OrderTracker/unchecked.png');


const StatusLog = ({
  status_log,
  seller
}) => {
  // renderStatusPath(timestamp, isFirst, isLast, height) {
  //
  //   const { status } = this.props;
  //
  //   // fill all the circle automatcially if the status between 100 & 200
  //   const shouldFillCircle = (timestamp || (status >= 100 && status <= 200));
  //
  //   const topLine = (
  //     <View style={{
  //       position: 'absolute',
  //       left: 28,
  //       backgroundColor: '#20C74B',
  //       height: 35,
  //       width: 4
  //     }} />
  //   );
  //
  //   const bottomLine = (
  //     <View style={{
  //       position: 'absolute',
  //       left: 28,
  //       top: 35,
  //       backgroundColor: '#20C74B',
  //       height: height-35,
  //       width: 4
  //     }} />
  //   );
  //
  //   return (
  //     <View style={{ width: 60, height }}>
  //
  //       {(isFirst ? null : topLine)}
  //       {(isLast ? null : bottomLine)}
  //
  //       <View style={{
  //         position: 'absolute',
  //         top: 20,
  //         left: 15,
  //         borderRadius: 15,
  //         width: 30,
  //         height: 30,
  //         backgroundColor: (shouldFillCircle ? '#20C74B' : 'white'),
  //         borderColor: '#20C74B',
  //         borderWidth: 4
  //       }} />
  //     </View>
  //   )
  // }

  //
  // renderLogItem(status, timestamp) {
  //
  //   const height = 120;
  //
  //   const isFirst = (status === 50);
  //   const isLast = (status === 100);
  //
  //
  //   return (
  //     <View style={{ height, borderBottomWidth: 1, borderColor: '#EDEDED', flexDirection: 'row' }}>
  //       <View style={{ flex: 1, paddingTop: 25 }}>
  //         <Text style={styles.logStatus}>{strings(`OrderStatuses.${status}`)}</Text>
  //       </View>
  //
  //       { this.renderStatusPath(timestamp, isFirst, isLast, height) }
  //
  //       <View style={{ width: 105, paddingTop: 22}}>
  //         <Text style={styles.dayText}>{dateString}</Text>
  //         <View style={{ flexDirection: 'row' }}>
  //           <Text style={styles.timeText}>{timeString}</Text>
  //           <Text style={styles.AMPMText}>{ampmString}</Text>
  //         </View>
  //       </View>
  //
  //     </View>
  //   )
  // }
  //
    // renderStatusLog() {
    //   const { status, status_log } = this.props;
    //
    //   if (status === 400) {
    //     return (
    //       <View style={{ padding: 20, backgroundColor: 'red', flexDirection: 'column', justifyContent: 'center'}}>
    //         <Text style={{ textAlign: 'right', color:'white', fontSize: 20,
    //         fontFamily: 'Poppins-Bold', }}>Cancelled by the store</Text>
    //       </View>
    //     );
    //   }
    //
    //
    //   if (status === 300) {
    //     return (
    //       <View style={{ padding: 20, backgroundColor: '#4f4f4f', flexDirection: 'column', justifyContent: 'center'}}>
    //         <Text style={{ textAlign: 'right', color:'white', fontSize: 20,
    //         fontFamily: 'Poppins-Bold', }}>{strings('OrderStatuses.300')}</Text>
    //       </View>
    //     );
    //   }
    //
    //
    //
    //
    //
    //   return (
    //     <View>
    //       { this.renderLogItem(50, timestamp_50) }
    //       { this.renderLogItem(90, timestamp_90) }
    //       { this.renderLogItem(100, timestamp_100) }
    //     </View>
    //   );
    // }


  const renderLogComponent = (status, timestamp, checked) => {

    let status_text = '';
    let timestamp_text = '';
    let image_source = unchecked_icon;

    // if the bullet should be checked, switch to checked icon
    if (checked) { image_source = checked_icon }

    // if there exists a timestamp for this item, proceed
    if (timestamp) {
      timestamp_text = formatTimestamp(timestamp, 'h:mm A');
    }

    if (status === 50) {
      status_text = strings('OrderStatusLog.confirmedOrder', { seller_name: translate(seller.display_name) })
    } else if (status === 90) {
      status_text = strings('OrderStatusLog.preparedOrder', { seller_name: translate(seller.display_name) })
    } else if (status === 100) {
      status_text = strings('OrderStatusLog.deliveringOrder')
    } else if (status === 200) {
      status_text = strings('OrderStatusLog.completedOrder')
    }

    return (
      <View style={{
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20
      }}>
        <View style={{ width: 32, height: 90, alignItems: 'center' }}>
          <View style={{
            flex: 1,
            width: 1,
            backgroundColor: '#EAEAEA'
          }} />
          <Image
            source={image_source}
            style={{
              top: 10,
              width: 32,
              height: 32,
              position: 'absolute',
             }}
            resizeMode={'contain'}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-start', marginTop: 14, marginLeft: 14 }}>
          <AyezText medium color={checked ? 'black' : '#8E8E93'}>{status_text}</AyezText>
          <AyezText regular color={AYEZ_GREEN}>{timestamp_text}</AyezText>
        </View>
      </View>
    );
  }

  if (!status_log) {
    return <ActivityIndicator size="small" />
  }

  const max_status = Math.max(...status_log.map(log => log.status));
  // an array for each bullet in the log
  const logComponents = [ 50, 90, 100, 200 ].map(status => {
    // max timestamp for this status
    const lastStatusInstance = status_log.slice().reverse().find(log => log.status === status);
    const timestamp = (lastStatusInstance ? lastStatusInstance.timestamp : 0);
    // determine if the statuses should be checked
    // DO NOT rely on timestamp, because sometimes intermediary
    // steps get skipped
    const checked = (status <= max_status);
    return renderLogComponent(status, timestamp, checked)
  });

  return (
    <View style={{ borderBottomWidth: 1, borderColor: '#EAEAEA' }}>
      { logComponents }
    </View>
  );
};


export { StatusLog };

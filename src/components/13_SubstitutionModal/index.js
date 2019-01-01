const { substitutionOrder } = this.props;

  if (!substitutionOrder) { return null }


  const itemsToSubstitute = substitutionOrder.items_array.filter(item => item.invalid);
  const imageComponents = itemsToSubstitute.map(item => (
    <CachedImage
      style={{
        width: 80,
        height: 80,
        margin: 8
      }}
      resizeMode={'contain'}
      source={{ uri: item.thumbnail_url || item.image_url }}
    />
  ));

    // if more than 4 items to replace, truncate and show an ellpises image

// {itemsToSubstitute.length} products</Text> from your order are out of stock

  return (
    <Modal
      animationType="fade"
      visible={this.state.substitutionModal}
    >
    <View style={{ backgroundColor: '#f25400', padding: 20, paddingTop: (statusBarMargin + 10), alignItems: 'center' }}>
      <Image
        style={{
          width: 100,
          height: 100,
          tintColor: 'white'
        }}
        resizeMode={'contain'}
        source={warningIcon}
      />
      <Text style={{ fontFamily: 'BahijJanna-Bold', color: 'white', fontSize: 22, marginTop: 8 }}>{strings('Substitution.header')}</Text>
    </View>

    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
      <Text style={{ fontFamily: 'BahijJanna', textAlign: 'center', color: 'black', fontSize: 18, marginBottom: 10 }}>
        {strings('Substitution.subheader')}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {imageComponents}
      </View>
      <View style={{ position: 'absolute', backgroundColor: 'transparent', bottom: 0, left: 0, right: 0 }}>
        <BlockButton
          text={strings('Substitution.goButton')}
          color={'#F05C64'}
          onPress={() => {
            this.setState({ substitutionModal: false });
            Actions.substitution({ itemsToSubstitute });
          }}
        />
        <TimerCountdown
            initialSecondsRemaining={substitutionOrder.substitution_deadline - Date.now()}
            onTimeElapsed={() => {
              this.setState({ substitutionModal: false });
              // skip substitutions (show a confirmation before this)
              this.props.submitOrderSubstitutions(substitutionOrder, []);
            }}
            style={{
              textAlign: 'center',
              fontFamily: 'BahijJanna',
              color: 'black',
              fontSize: 18,
              marginBottom: 10
            }}
            formatSecondsRemaining={(milliseconds) => {
              let seconds = Math.round(milliseconds/1000);
              let minutes = Math.floor(seconds/60);
              seconds = seconds % 60;
              return `${minutes}:${padNumberZeros(seconds, 2)}`
            }}
        />
      </View>
    </View>
    </Modal>
  );

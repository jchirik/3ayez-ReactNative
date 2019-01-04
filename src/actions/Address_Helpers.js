
export const getTitleFromGooglePlace = (result) => {

  let title = '';
  let type = '';

  const relevant_components = result.address_components.filter(cmp => {

    // get rid of street_address from the components (never accurate)
    const not_street_number = !cmp.types.includes('street_number');
    const not_unnamed_en = (cmp.short_name !== 'Unnamed Road');
    return not_street_number && not_unnamed_en;
  });
  // get the most precise component after that
  if (relevant_components.length > 0) {
    title = relevant_components[0].short_name;
    type = relevant_components[0].types[0];
  }

  console.log('getTitleFromGooglePlace', title, type);
  return { title, type };
};

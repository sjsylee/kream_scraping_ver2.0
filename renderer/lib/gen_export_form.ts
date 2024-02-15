export function gen_export_form(dat: any[]) {
  const new_form = dat.map((pd) => {
    return {
      제품명: pd["name"],
      "정산 금액": pd["profit"],
      수수료: pd["fee"],
      사이즈: pd["size"],
      거래일시: pd["deal_date"],
      정산일: pd["calc_date"],
      "거래 ID": pd["key"],
    };
  });
  return new_form;
}

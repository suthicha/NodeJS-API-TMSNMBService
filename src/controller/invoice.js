var squel = require('squel');
var helper = require('../core/helper');
var settings = require('../settings');


exports.get = function(req, resp, id) {
  try {

      if(!id) throw new Error("Invalid invoice number");

      var sql = squel.select()
          .from("API_INV4TMS")
          .field("RTRIM(LTRIM(COMMERCIAL_INV_NO)) AS COMMERCIAL_INV_NO")
          .field("LINE_NO")
          .field("RTRIM(LTRIM(COMMODITY_DESC)) AS COMMODITY_DESC")
          .field("CUSTOMER_CODE")
          .field("CORP_CODE")
          .field("DIVISION_ID")
          .field("LOAD_LOCATION_ID")
          .field("DROP_LOCATION_ID")
          .field("GROSS_WEIGHT")
          .field("NUMBER_OF_PACKAGE")
          .field("UOM_PACKAGE")
          .field("PACK_HEIGHT")
          .field("PACK_LENGTH")
          .field("PACK_WIDTH")
          .field("VOLUME")
          .field("BATCH_NO")
          .field("SHIPMENT_TYPE")
          .field("SHIPMENT_MODE")
          .field("TRXNO")
          .where("TRXNO = ?", id)
          .toString();
      helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
    
  }catch (err) {

  }
}

exports.getList = function(req, resp) {
  try {
      var sql = squel.select()
        .from("API_INV4TMS")
        .field("TRXNO")
        .toString();

      helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);
    
  }catch (err) {

  }
}

exports.delete = function(req, resp, id) {
  try {

      if (!id) throw new Error("Invalid transaction id.");

      var sql = squel.delete()
        .from("API_INV4TMS")
        .where(" TRXNO = ?", id)
        .toString();
      
      helper.execCommandWithConnection(req, resp, sql, settings.dbConfig);

  } catch (err) {

  }
}
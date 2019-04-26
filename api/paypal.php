<?php
// Autoload SDK package for composer based installations
require '3rdParty/PayPal-PHP-SDK/autoload.php';

$apiContext = new \PayPal\Rest\ApiContext(
  new \PayPal\Auth\OAuthTokenCredential(
      //Sandbox RecordDropCogent
    'AbRwC4jbxj3UZCTUPDza6ALnQ02eRYkWBGBHGCjehp-yr2FE94sh0-kyzicJihK8E36M7btOiKaYImuu',
    'EL3XqXw18Ql5zES6O5bZcbhvYe14fo_ylm165ByQGqzJEtUMWwYzKmqTFEQJBbu9PTea5mmUQE9iSwrr'
    //Live RecordDropCogent
    //'AS0dkyE3ub7liyJFAQIx2YlU1U41Oo-fnp_EpjtRulxzKBJM5PmSQpHqPO5HPSshpXpTeeiXRoA-pwc1',
    //'ENxzFGS1VE2zoQPka_OBrFDB0ffEfuTCvg0ESSAHSOR8jzZcUUMDGQzlvPRNvUpE9USpJAEnk_tkTe2x'
  )
);
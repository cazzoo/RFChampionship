<?php

namespace RFC\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class RFCUserBundle extends Bundle
{
    public function getParent()
    {
        return 'FOSUserBundle';
    }
}

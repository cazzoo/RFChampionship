<?php
namespace RFC\UserBundle\Entity;

abstract class RoleEnum
{

    private static $enum = array(
        'ROLE_BANNISHED' => 'Bannished',
        'ROLE_USER' => 'Regular user',
        'ROLE_MANAGER' => 'Manager',
        'ROLE_CERTIFIED_MANAGER' => 'Certified Manager',
        'ROLE_ADMIN' => 'Administrator'
    );

    public static function toOrdinal($name)
    {
        return array_search($name, self::$enum);
    }

    public static function toString($ordinal)
    {
        return self::$enum[$ordinal];
    }
    
    public static function getEnum()
    {
        return self::$enum;
    }

    public static function getKeys()
    {
        return array_keys(self::$enum);
    }

    public static function getValues()
    {
        return array_values(self::$enum);
    }
}
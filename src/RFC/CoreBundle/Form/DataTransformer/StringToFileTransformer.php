<?php
/*  //RF//Championship is a multi-racing game team manager that allows members to organize and follow championships.
    Copyright (C) 2014 - //Racing-France//

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

namespace RFC\CoreBundle\Form\DataTransformer;

use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use RFC\CoreBundle\Entity\File;

class StringToFileTransformer implements DataTransformerInterface
{
    /**
     * @var string
     */
    private $webDir;

    /**
     * @var string
     */
    private $uploadDir;

    public function __construct($webDir, $uploadDir)
    {
        $this->webDir    = $webDir;
        $this->uploadDir = $uploadDir;
    }

    /**
     * {@inheritDoc}
     */
    public function transform($value)
    {
        if (is_string($value) && !empty($value)) {
            $file = new File();
            $file->setPath($this->webDir . '/' . $value);
            return $file;
        }

        return null;
    }

    /**
     * {@inheritDoc}
     */
    public function reverseTransform($file)
    {
        return $file;
        $value = '';
        if ($file instanceof UploadedFile) {
            return $file;
            $filename = uniqid() . '.' . $file->guessExtension();
            $file->move($this->webDir . '/' .  $this->uploadDir, $filename);
            $value = $this->uploadDir . '/' . $filename;
        }
        return $value;
    }

}
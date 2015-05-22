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

namespace AdrienBrault\ApiBundle\Form\EventListener;

use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * ReplaceNotSubmittedValuesByDefaultsListener
 *
 * This could be used by forms with PATCH requests for example.
 *
 * @author Adrien Brault <adrien.brault@gmail.com>
 */
class ReplaceNotSubmittedValuesByDefaultsListener implements EventSubscriberInterface
{
    private $factory;
    private $ignoreRequiredFields;

    public function __construct(FormFactoryInterface $factory, $ignoreRequiredFields = true)
    {
        $this->factory = $factory;
        $this->ignoreRequiredFields = $ignoreRequiredFields;
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return array(FormEvents::PRE_BIND => 'preBind');
    }

    /**
     * {@inheritdoc}
     */
    public function preBind(FormEvent $event)
    {
        $form = $event->getForm();
        $submittedData = $event->getData();

        if ($form->getConfig()->getCompound()) {
            foreach ($form->all() as $name => $child) {
                if (!isset($submittedData[$name])
                    && (!$this->ignoreRequiredFields || !$child->isRequired())) {
                    $submittedData[$name] = $child->getData();
                }
            }
        }

        $event->setData($submittedData);
    }
}
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

namespace RFC\CoreBundle\Controller;

use RFC\CoreBundle\Entity\File;
use RFC\CoreBundle\Form\Type\FileType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\HttpFoundation\Request;

/**
 * Track controller.
 */
class GalleryController extends RFCController
{
    public function manageAction($entityType, $entityId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:' . $entityType . '')->find($entityId);

        return $this->render('RFCCoreBundle:Gallery:index.html.twig', array(
            'entity' => $entity,
            'entityType' => $entityType
        ));
    }

    /**
     * Add a file to a gallery
     * @param Request $request
     * @param $entityType
     * @param $entityId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function addFileAction(Request $request, $entityType, $entityId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entity = $entityManager->getRepository('RFCCoreBundle:' . $entityType . '')->find($entityId);

        $uploaded_file = new File();
        $form = $this->createForm(new FileType(), $uploaded_file);

        if ($form->handleRequest($request)->isValid()) {
            $entity->addImage($uploaded_file);

            $this->get('stof_doctrine_extensions.uploadable.manager')
                ->markEntityToUpload($uploaded_file, $uploaded_file->getFile());

            $entityManager->flush();

            return $this->redirect($this->generateUrl('rfcCore_manageGallery', array(
                'entityType' => $entityType,
                'entityId' => $entityId
            )));
        }

        return $this->render('RFCCoreBundle:Gallery:newFile.html.twig', array(
            'form' => $form->createView(),
            'entityId' => $entityId,
            'entityType' => $entityType
        ));
    }

    /**
     * Deletes a File entity.
     * @param $fileId
     * @param $entityType
     * @param $entityId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function removeFileAction($fileId, $entityType, $entityId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $entity = $entityManager->getRepository('RFCCoreBundle:' . $entityType . '')->find($entityId);
        $file = $entityManager->getRepository('RFCCoreBundle:File')->find($fileId);

        if (!$file) {
            throw $this->createNotFoundException('Unable to find File entity.');
        }

        $entity->removeImage($file);
        $entityManager->flush();

        return $this->redirect($this->generateUrl('rfcCore_manageGallery', array(
            'entityType' => $entityType,
            'entity' => $entity,
            'entityId' => $entityId
        )));
    }
}
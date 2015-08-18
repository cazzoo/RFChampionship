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
use RFC\CoreBundle\Form\FileType;
use RFC\FrameworkBundle\Controller\RFCController;
use Symfony\Component\HttpFoundation\Request;
use RFC\CoreBundle\Entity\Gallery;

/**
 * Track controller.
 */
class GalleryController extends RFCController
{
    public function accessAction($entityType, $entityId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:' . $entityType . '')->find($entityId);

        if ($entity->getGallery() === null) {
            $entity->setGallery(new Gallery());
            $entityManager->flush();
        }

        return $this->redirect($this->generateUrl('rfcCore_showGallery', array(
            'galleryId' => $entity->getGallery()->getId()
        )));
    }

    public function indexAction($galleryId)
    {
        $entityManager = $this->getDoctrine()->getManager();

        $entity = $entityManager->getRepository('RFCCoreBundle:Gallery')->find($galleryId);

        return $this->render('RFCCoreBundle:Gallery:index.html.twig', array(
            'gallery' => $entity
        ));
    }

    /**
     * Add a file to a gallery
     * @param Request $request
     * @param $galleryId
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function addFileAction(Request $request, $galleryId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $gallery = $entityManager->getRepository('RFCCoreBundle:Gallery')->find($galleryId);
        $file = new File;
        $file->setGallery($gallery);
        $form = $this->createForm(new FileType, $file);

        if ($form->handleRequest($request)->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($file);

            $this->get('stof_doctrine_extensions.uploadable.manager')
                ->markEntityToUpload($file, $file->getPath());

            $em->flush();

            return $this->redirect($this->generateUrl('rfcCore_showGallery', array(
                'galleryId' => $gallery->getId()
            )));
        }

        return $this->render('RFCCoreBundle:Gallery:newFile.html.twig', array(
            'form' => $form->createView(),
            'gallery' => $gallery
        ));
    }

    /**
     * Deletes a File entity.
     */
    public function removeFileAction($fileId, $galleryId)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $file        = $entityManager->getRepository('RFCCoreBundle:File')->find($fileId);

        if (!$file) {
            throw $this->createNotFoundException('Unable to find File entity.');
        }

        $entityManager->remove($file);
        $entityManager->flush();

        return $this->redirect($this->generateUrl('rfcCore_showGallery', array(
                'galleryId' => $galleryId,
            )));
    }
}
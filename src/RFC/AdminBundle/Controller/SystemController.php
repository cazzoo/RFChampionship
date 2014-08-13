<?php
namespace RFC\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use RFC\CoreBundle\Entity\Game;
use RFC\CoreBundle\Form\GameType;
use RFC\CoreBundle\Entity\Image;

/**
 * System controller.
 */
class SystemController extends Controller
{

    /**
     * System properties.
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();
        
        return $this->render('RFCAdminBundle:System:index.html.twig', array(
        ));
    }
}
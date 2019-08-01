<?php

namespace App\Events;

use App\Entity\Invoice;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use App\Repository\InvoiceRepository;

class InvoiceSubscriber implements EventSubscriberInterface{

	private $security;
	private $repository;

	function __construct(Security $security, InvoiceRepository $repository)
	{
		$this->security = $security;
		$this->repository = $repository;
	}

	public static function getSubscribedEvents(){
		return [
			KernelEvents::VIEW => ['setDataForInvoice', EventPriorities::PRE_VALIDATE]
		];
	}


	/**
	 * Set Chrono & DateTime
	 */
	public function setDataForInvoice(GetResponseForControllerResultEvent $event)
	{
		$result = $event->getControllerResult();
		$method = $event->getRequest()->getMethod();

		if ($result instanceof Invoice && $method === "POST") {
			// Catcher l'utilisateur connecter
			$chrono = $this->repository->findNextChrono($this->security->getUser());
			$result->setChrono($chrono);
			$result->setSentAt(new \DateTime());
		}
	}
}

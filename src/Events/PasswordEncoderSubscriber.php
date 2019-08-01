<?php

namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class PasswordEncoderSubscriber implements EventSubscriberInterface {

	/**
	 * L'encodeur de mot de passe
	 * 
	 * @var UserPasswordEncoderInterface
	 */
	private $encoder;

	public function __construct(UserPasswordEncoderInterface $encoder){
			$this->encoder = $encoder;
	}


	public static function getSubscribedEvents()
	{
		return [
			KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
		];
	}

	public function encodePassword(GetResponseForControllerResultEvent $event)
	{
		$result = $event->getControllerResult();
		$method = $event->getRequest()->getMethod();

		if ($result instanceof User && $method === "POST") {
			$hash = $this->encoder->encodePassword($result, $result->getPassword());
			$result->setPassword($hash);
		}
	}
}
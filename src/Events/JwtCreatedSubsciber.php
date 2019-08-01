<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubsciber {
	
	public function updateJwtData(JWTCreatedEvent $event)
	{
		// Récupération de l'user pour avoir son firstname et lastname
		$user = $event->getUser();

		// Enrichi les datas
		$data = $event->getData();
		$data['firstName'] = $user->getFirstName();
		$data['lastName'] = $user->getLastName();

		$event->setData($data);
	}
}
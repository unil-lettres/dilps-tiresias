<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Model\AbstractModel;
use Application\Utility;
use Doctrine\Common\Util\ClassUtils;
use InvalidArgumentException;
use Laminas\Permissions\Acl\Resource\GenericResource;

/**
 * An ACL resource linked to a specific instance of an \Application\Model\*
 * Usage:
 *        $r = new \Application\Acl\ModelResource(Question::class, $question);
 *        $question = $r->getInstance();
 *        $r = new \Application\Acl\ModelResource(Message::class, 432);
 *        $message = $r->getInstance();
 */
class ModelResource extends GenericResource
{
    /**
     * Unique id of the instance of resource
     *
     * @var null|AbstractModel
     */
    private $instance;

    /**
     * Sets the Resource identifier
     *
     * @param string $class must be a model class name
     * @param AbstractModel $instance the instance itself
     */
    public function __construct(string $class, ?AbstractModel $instance = null)
    {
        if (!is_subclass_of($class, AbstractModel::class)) {
            throw new InvalidArgumentException('The class name must be an implementation of AbstractModel but given: ' . $class);
        }

        $class = ClassUtils::getRealClass($class);

        parent::__construct($class);
        $this->instance = $instance;
    }

    /**
     * Returns the specific instance of resource found by its type and id.
     *
     * @return null|AbstractModel
     */
    public function getInstance(): ?AbstractModel
    {
        return $this->instance;
    }

    /**
     * Returns a name identifying this resource for exception messages for developers
     *
     * @return string
     */
    public function getName(): string
    {
        $instance = $this->getInstance();

        return Utility::getShortClassName($instance) . '#' . $instance->getId();
    }
}

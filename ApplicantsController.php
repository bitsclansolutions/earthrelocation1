<?php

namespace App\Controller\Admin;

use App\Controller\AppController;
use Cake\Event\Event;
use Cake\Core\Configure;
use Cake\Network\Exception\NotFoundException;
use Cake\View\Exception\MissingTemplateException;
use Cake\ORM\TableRegistry;
use Cake\Datasource\ConnectionManager;

use Cake\I18n\FrozenDate;
use Cake\Database\Type;
use Cake\Routing\Router;

Type::build('date')->setLocaleFormat('yyyy-MM-dd');

/**
 * Customers Controller
 *
 * @property \App\Model\Table\CustomersTable $Customers
 */
class ApplicantsController extends AppController {

    public function initialize() {
        parent::initialize();
        //$this->Auth->allow(['index', 'view','edit','chstatus']);
    }

    public $uses = array('User', 'Admin');







    /**
     * Index method
     *
     * @return \Cake\Network\Response|null
     */
    /*
      public function beforeFilter(Event $event) {
      if (!$this->request->session()->check('Auth.Admin')) {
      return $this->redirect(
      ['controller' => 'Users', 'action' => 'index']
      );
      }
      }

     */

    public function index() {

        $this->viewBuilder()->layout('admin');
        $this->loadModel('Applicantstatus');
     $applicant = $this->paginate($this->Applicantstatus,['limit' => 10]);
       // echo "<pre>"; print_r($applicants);die;
        $this->set(compact('applicant'));
        $this->set('_serialize', ['applicant']);

    }

     /**
     * View method
     *
     * @param string|null $id Customer id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    // public function view($id = null) {

    //     $this->viewBuilder()->layout('admin');
    //     $property = $this->Properties->get($id,['contain'=>"Categories"]);
    //     //$results = $customer->toArray(); pr($results); exit;

    //     $this->set('property', $property);
    //     $this->set('_serialize', ['property']);
    // }

    /**
     * Edit method
     *
     * @param string|null $id Customer id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */

    public function delete($id){
        $this->loadModel('Applicantstatus');
        $result = $this->Applicantstatus->get($id);
       // print_r($result);die;
        if ($this->Applicantstatus->delete($result)) {
            $this->Flash->success(__('Applicant has been deleted.'));
        } else {
            $this->Flash->error(__('Applicant not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }

    function edit($id=null){
    // echo 'llll'; die;
        $this->loadModel('Applicantstatus');
        $applicantstatus =  $this->Applicantstatus->get($id);
        // pr($applicantstatus);
        // die();
        if ($this->request->is(['patch', 'post', 'put'])) {


            $flag = true;


            if($this->request->data['name'] == ""){
                $this->Flash->error(__('Name can not be null. Please, try again.')); $flag = false;
            }

             if($flag){
                $applicantstatus = $this->Applicantstatus->patchEntity($applicantstatus, $this->request->data);
                if ($this->Applicantstatus->save($applicantstatus)) {
                    $this->Flash->success(__('status has been updated.'));
                    return $this->redirect(['action' => 'index']);
                } else {
                    $this->Flash->error(__('status could not be update. Please, try again.'));
                }
            }
        }

        $this->set(compact('applicantstatus'));
        $this->set('_serialize', ['applicantstatus']);
    }

    public function add($id = null) {
        // echo "sahhj";
        // die();
        //$this->viewBuilder()->layout('admin');
        $this->loadModel('Applicantstatus');
        $applicantstatus =  $this->Applicantstatus->newEntity();
        if ($this->request->is(['patch', 'post', 'put'])) {
            $flag = true;
            if($this->request->data['name'] == ""){
                $this->Flash->error(__('Name can not be null. Please, try again.')); $flag = false;
            }

            if($flag){
                $applicantstatus = $this->Applicantstatus->patchEntity($applicantstatus, $this->request->data);
                if ($this->Applicantstatus->save($applicantstatus)) {
                    $this->Flash->success(__('Applicant Status has been saved.'));
                    return $this->redirect(['action' => 'index']);
                } else {
                    $this->Flash->error(__('Applicant Status could not be add. Please, try again.'));
                }
            }
        }
        $this->set(compact('applicantstatus'));
        $this->set('_serialize', ['applicantstatus']);
    }




}
